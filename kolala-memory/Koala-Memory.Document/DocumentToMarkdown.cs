using System.Diagnostics;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;
using DocumentFormat.OpenXml.Drawing;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using UglyToad.PdfPig;
using Break = DocumentFormat.OpenXml.Wordprocessing.Break;
using TableCell = DocumentFormat.OpenXml.Wordprocessing.TableCell;
using TableRow = DocumentFormat.OpenXml.Wordprocessing.TableRow;
using WordParagraph = DocumentFormat.OpenXml.Wordprocessing.Paragraph;
using Drawing = DocumentFormat.OpenXml.Spreadsheet.Drawing;
using Hyperlink = DocumentFormat.OpenXml.Spreadsheet.Hyperlink;
using Table = DocumentFormat.OpenXml.Spreadsheet.Table;
using Text = DocumentFormat.OpenXml.Spreadsheet.Text;
using Page = UglyToad.PdfPig.Content.Page;
using Path = System.IO.Path;
using Run = DocumentFormat.OpenXml.Wordprocessing.Run;

namespace Koala;

public class DocumentToMarkdown(
    string? imageOutputPath = null,
    bool useBase64 = false)
{
    private string? _imageOutputPath = imageOutputPath;

    /// <summary>
    /// Converts .doc file (older Word format) to markdown using binary format reading
    /// </summary>
    private string ConvertDocToMarkdown(Stream stream, ref int requestToken,
        string docFileName)
    {
        StringBuilder markdown = new StringBuilder();

        try
        {
            // Try using Word Interop if available
            if (IsWordInteropAvailable())
            {
                using MemoryStream ms = new MemoryStream();
                stream.CopyTo(ms);
                ms.Position = 0;
                string tempFilePath = SaveToTempFile(ms, ".doc");

                try
                {
                    string extractedText = ExtractTextUsingWordInterop(tempFilePath);
                    markdown.Append(FormatExtractedText(extractedText));
                }
                finally
                {
                    // Clean up temp file
                    try
                    {
                        if (File.Exists(tempFilePath)) File.Delete(tempFilePath);
                    }
                    catch
                    {
                        Debug.WriteLine("Failed to delete temp file: " + tempFilePath);
                    }
                }
            }
            else
            {
                // Fallback to binary format reader
                markdown.AppendLine("<!-- Using basic binary DOC parser -->");
                string text = ExtractTextFromDocBinary(stream);
                markdown.Append(FormatExtractedText(text));
            }
        }
        catch (Exception ex)
        {
            markdown.AppendLine($"<!-- Warning: Document parsing failed: {ex.Message} -->");
            markdown.AppendLine("<!-- Attempting basic text extraction -->");

            // Very basic fallback - try to extract any readable text
            try
            {
                stream.Position = 0;
                string text = ExtractBasicTextFromStream(stream);
                markdown.Append(text);
            }
            catch
            {
                markdown.AppendLine("<!-- Document could not be parsed in any available format -->");
            }
        }

        return markdown.ToString();
    }

    /// <summary>
    /// Checks if Word Interop is available on the system
    /// </summary>
    private bool IsWordInteropAvailable()
    {
        try
        {
            // Check if the Word Interop assembly is available
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            {
                // 检查 Word Interop 程序集是否可用
                var wordType = Type.GetTypeFromProgID("Word.Application");
                return wordType != null;
            }

            return false;
        }
        catch
        {
            return false;
        }
    }

    /// <summary>
    /// Saves stream to a temporary file
    /// </summary>
    private string SaveToTempFile(Stream stream, string extension)
    {
        var tempPath = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName() + extension);
        using var fileStream = File.Create(tempPath);
        stream.Seek(0, SeekOrigin.Begin);
        stream.CopyTo(fileStream);

        return tempPath;
    }

    /// <summary>
    /// Extracts text from .doc using Word Interop
    /// </summary>
    private string ExtractTextUsingWordInterop(string filePath)
    {
        // This code uses reflection to avoid direct reference to Microsoft.Office.Interop.Word
        // which might not be available in all environments

        object wordApp = null;
        object document = null;
        StringBuilder content = new StringBuilder();

        try
        {
            // Create Word application instance
            Type wordAppType = Type.GetTypeFromProgID("Word.Application");
            wordApp = Activator.CreateInstance(wordAppType);

            // Set visible to false
            wordAppType.GetProperty("Visible").SetValue(wordApp, false);

            // Get Documents collection
            object documents = wordAppType.GetProperty("Documents").GetValue(wordApp);
            Type documentsType = documents.GetType();

            // Open document
            object filename = filePath;
            object readOnly = true;
            object missing = Type.Missing;
            document = documentsType.InvokeMember("Open",
                BindingFlags.InvokeMethod,
                null, documents,
                new object[] { filename, missing, readOnly });

            // Get document content
            Type documentType = document.GetType();
            string text = (string)documentType.GetProperty("Content").GetValue(document).GetType()
                .GetProperty("Text").GetValue(documentType.GetProperty("Content").GetValue(document));
            content.Append(text);

            // Close document
            object saveChanges = false;
            documentType.InvokeMember("Close",
                BindingFlags.InvokeMethod,
                null, document,
                new object[] { saveChanges });

            return content.ToString();
        }
        catch (Exception ex)
        {
            throw new Exception("Error using Word Interop: " + ex.Message, ex);
        }
        finally
        {
            // Clean up COM objects
            if (document != null)
            {
                Marshal.ReleaseComObject(document);
            }

            if (wordApp != null)
            {
                wordApp.GetType().InvokeMember("Quit",
                    BindingFlags.InvokeMethod,
                    null, wordApp, new object[] { });
                Marshal.ReleaseComObject(wordApp);
            }

            GC.Collect();
            GC.WaitForPendingFinalizers();
        }
    }

    /// <summary>
    /// Format extracted raw text into better markdown
    /// </summary>
    private string FormatExtractedText(string text)
    {
        StringBuilder markdown = new StringBuilder();

        // Split into lines and process
        string[] lines = text.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        bool inList = false;

        for (int i = 0; i < lines.Length; i++)
        {
            string line = lines[i].Trim();

            if (string.IsNullOrWhiteSpace(line))
            {
                markdown.AppendLine();
                inList = false;
                continue;
            }

            // Try to detect headings
            if (IsLikelyHeading(line))
            {
                inList = false;
                if (i > 0) markdown.AppendLine();
                markdown.AppendLine("## " + line);
                markdown.AppendLine();
            }
            // Try to detect bullet lists
            else if (line.StartsWith("•") || line.StartsWith("*") || line.StartsWith("-") ||
                     Regex.IsMatch(line,
                         @"^\s*[\u2022\u2023\u2043\u204C\u204D\u2219\u25AA\u25CF\u25E6\u2981\u2999]"))
            {
                string cleanLine = Regex.Replace(line,
                    @"^[\s\u2022\u2023\u2043\u204C\u204D\u2219\u25AA\u25CF\u25E6\u2981\u2999*-]+", "").Trim();
                markdown.AppendLine("* " + cleanLine);
                inList = true;
            }
            // Try to detect numbered lists
            else if (Regex.IsMatch(line, @"^\s*\d+[\.\)]\s+"))
            {
                string cleanLine = Regex.Replace(line, @"^\s*\d+[\.\)]\s+", "").Trim();
                markdown.AppendLine("1. " + cleanLine);
                inList = true;
            }
            // Regular paragraph
            else
            {
                if (inList)
                {
                    markdown.AppendLine();
                    inList = false;
                }

                markdown.AppendLine(line);

                // Add blank line after paragraph
                if (i < lines.Length - 1 && !string.IsNullOrWhiteSpace(lines[i + 1].Trim()))
                {
                    markdown.AppendLine();
                }
            }
        }

        return markdown.ToString();
    }

    /// <summary>
    /// Extracts text directly from .doc binary format
    /// This is a very basic implementation that only extracts plain text
    /// </summary>
    private string ExtractTextFromDocBinary(Stream stream)
    {
        StringBuilder text = new StringBuilder();

        try
        {
            stream.Position = 0;
            byte[] bytes = new byte[stream.Length];
            stream.ReadExactly(bytes, 0, (int)stream.Length);

            // Very basic implementation to extract plain text
            // DOC files have text in UTF-16 LE encoding with numerous control codes

            // First, try to find the text part of the document
            int startPos = -1;

            // Try to find some common markers
            for (int i = 0; i < bytes.Length - 20; i++)
            {
                // Look for potential start of text section
                if (bytes[i] == 0x42 && bytes[i + 1] == 0x00 && bytes[i + 2] == 0x6F && bytes[i + 3] == 0x00 &&
                    bytes[i + 4] == 0x64 && bytes[i + 5] == 0x00 && bytes[i + 6] == 0x79 &&
                    bytes[i + 7] == 0x00)
                {
                    startPos = i + 8; // After "Body" marker
                    break;
                }
            }

            if (startPos < 0)
            {
                // If we can't find the text part, return a fallback message
                return
                    "The document could not be parsed in binary format. Please convert to .docx format for better results.";
            }

            // Extract text - looking for Unicode strings
            for (int i = startPos; i < bytes.Length - 1; i += 2)
            {
                // Check if this is a printable character (basic ASCII range)
                if (bytes[i] >= 32 && bytes[i] < 127 && bytes[i + 1] == 0)
                {
                    text.Append((char)bytes[i]);
                }
                else if (bytes[i] == 13 && bytes[i + 1] == 0)
                {
                    text.AppendLine(); // CR/LF
                }
            }

            return text.ToString();
        }
        catch (Exception ex)
        {
            return "Error extracting text from binary DOC: " + ex.Message;
        }
    }

    /// <summary>
    /// Basic text extraction - tries to get any text content from the binary stream
    /// </summary>
    private string ExtractBasicTextFromStream(Stream stream)
    {
        StringBuilder text = new StringBuilder();

        using (MemoryStream ms = new MemoryStream())
        {
            stream.CopyTo(ms);
            byte[] bytes = ms.ToArray();

            // Try to extract ASCII and Unicode strings
            for (int i = 0; i < bytes.Length - 1; i++)
            {
                // Look for potential text strings
                if (bytes[i] >= 32 && bytes[i] < 127)
                {
                    // If this is the start of a potential string, extract it
                    int start = i;
                    StringBuilder word = new StringBuilder();

                    while (i < bytes.Length && bytes[i] >= 32 && bytes[i] < 127)
                    {
                        word.Append((char)bytes[i]);
                        i++;
                    }

                    // Only keep reasonably sized words (likely to be real text)
                    if (word.Length > 3)
                    {
                        text.Append(word);
                        text.Append(" ");
                    }
                }
            }
        }

        // Format the extracted text
        string result = text.ToString();
        result = Regex.Replace(result, @"\s{2,}", " "); // Remove excess spaces
        result = Regex.Replace(result, @"(.{50,}?)\s", "$1\n"); // Add line breaks for readability

        return result;
    }

    /// <summary>
    /// Enhanced version of ConvertWordToMarkdown that handles .docx files better
    /// </summary>
    public string ConvertWordToMarkdown(Stream stream)
    {
        StringBuilder markdown = new StringBuilder();

        try
        {
            using (WordprocessingDocument doc = WordprocessingDocument.Open(stream, false))
            {
                var body = doc.MainDocumentPart?.Document.Body;
                if (body == null) throw new InvalidOperationException("Document body is null");

                // Process document styles
                IDictionary<string, TableStyle> tableStyles = new Dictionary<string, TableStyle>();
                if (doc.MainDocumentPart?.StyleDefinitionsPart != null)
                {
                    var stylesPart = doc.MainDocumentPart.StyleDefinitionsPart;
                    var styles = stylesPart.Styles;
                    foreach (var style in styles?.Elements<Style>().Where(s => s.Type == StyleValues.Table))
                    {
                        if (style.StyleId != null)
                        {
                            tableStyles[style.StyleId] = new TableStyle
                            {
                                StyleId = style?.StyleId.Value ?? "",
                                Name = style?.StyleName?.Val?.Value ?? ""
                            };
                        }
                    }
                }

                // Track context state
                bool inList = false;
                int currentListLevel = 0;
                bool inTable = false;
                string previousListId = null;
                int previousListLevel = -1;

                foreach (var element in body.ChildElements)
                {
                    if (element is WordParagraph para)
                    {
                        ProcessParagraph(para, doc, markdown, ref inList, ref currentListLevel, ref previousListId,
                            ref previousListLevel);
                    }
                    else if (element is Table table)
                    {
                        inList = false; // End previous list
                        ProcessTable(table, markdown);
                        inTable = true;
                    }
                    else if (element is SectionProperties)
                    {
                        // Handle section properties if needed
                    }
                }
            }
        }
        catch (Exception ex)
        {
            // Fallback to simple text extraction for problematic files
            try
            {
                stream.Position = 0;
                markdown.AppendLine("<!-- Using fallback text extraction due to error: " + ex.Message + " -->");

                using (MemoryStream ms = new MemoryStream())
                {
                    stream.CopyTo(ms);
                    ms.Position = 0;

                    // Try alternative approach
                    try
                    {
                        string tempFilePath = SaveToTempFile(ms, ".docx");
                        try
                        {
                            if (IsWordInteropAvailable())
                            {
                                string extractedText = ExtractTextUsingWordInterop(tempFilePath);
                                markdown.Append(FormatExtractedText(extractedText));
                            }
                            else
                            {
                                // Basic fallback
                                ms.Position = 0;
                                string text = ExtractBasicTextFromStream(ms);
                                markdown.Append(FormatExtractedText(text));
                            }
                        }
                        finally
                        {
                            // Clean up temp file
                            try
                            {
                                if (File.Exists(tempFilePath)) File.Delete(tempFilePath);
                            }
                            catch
                            {
                            }
                        }
                    }
                    catch
                    {
                        // Last resort - try to extract any text
                        ms.Position = 0;
                        string text = ExtractBasicTextFromStream(ms);
                        markdown.Append(text);
                    }
                }
            }
            catch (Exception fallbackEx)
            {
                markdown.AppendLine($"<!-- Document parsing failed completely: {fallbackEx.Message} -->");
            }
        }

        return markdown.ToString();
    }

    /// <summary>
    /// Determines if text is likely a heading
    /// </summary>
    private bool IsLikelyHeading(string line)
    {
        return !string.IsNullOrEmpty(line)
               && line.Length < 100
               && !line.EndsWith(".")
               && char.IsUpper(line[0]);
    }

    public string ConvertPdfToMarkdown(Stream stream, ref int requestToken,
        string docFileName)
    {
        StringBuilder textContent = new StringBuilder();
        List<(byte[] ImageData, string FileName, string MimeType)> allImages = new();

        using (PdfDocument document = PdfDocument.Open(stream))
        {
            foreach (var page in document.GetPages())
            {
                // Extract text
                string pageText = ExtractText(page);
                pageText = ProcessHeadings(pageText);
                pageText = ProcessLists(pageText);
                pageText = ProcessParagraphs(pageText);
                textContent.Append(pageText);

                // Extract images
                if (_imageOutputPath != null || useBase64)
                {
                    var pageImages = ExtractImagesData(page);
                    allImages.AddRange(pageImages);
                    foreach (var image in pageImages)
                    {
                        textContent.Append("![image](" + image.FileName + ")\n");
                    }
                }
            }
        }

        return textContent.ToString();
    }

    private List<(byte[] ImageData, string FileName, string MimeType)> ExtractImagesData(Page page)
    {
        var result = new List<(byte[] ImageData, string FileName, string MimeType)>();
        var images = page.GetImages();

        foreach (var image in images)
        {
            string filename = Path.GetRandomFileName();
            filename = Path.ChangeExtension(filename, ".png");
            byte[] bytes = image.RawBytes.ToArray();

            // Determine MIME type based on image data
            string mimeType = "image/png"; // Default
            if (bytes.Length > 2 && bytes[0] == 0xFF && bytes[1] == 0xD8)
            {
                mimeType = "image/jpeg";
            }

            if (!useBase64 && !string.IsNullOrEmpty(_imageOutputPath))
            {
                Directory.CreateDirectory(_imageOutputPath);
                string imagePath = Path.Combine(_imageOutputPath, filename);
                File.WriteAllBytes(imagePath, bytes);
                filename = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "images", filename);

                if (!Directory.Exists(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "images")))
                {
                    Directory.CreateDirectory(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "images"));
                }
            }

            result.Add((bytes, filename, mimeType));
        }

        return result;
    }

    private string ExtractText(Page page)
    {
        StringBuilder text = new StringBuilder();

        // Get all text blocks
        var words = page.GetWords();
        var sortedWords = words.OrderBy(w => w.BoundingBox.Bottom)
            .ThenBy(w => w.BoundingBox.Left)
            .ToList();

        var currentLine = sortedWords.FirstOrDefault()?.BoundingBox.Bottom ?? 0;

        foreach (var word in sortedWords)
        {
            // Check if a new line is needed
            if (Math.Abs(word.BoundingBox.Bottom - currentLine) > 5f)
            {
                text.AppendLine();
                currentLine = word.BoundingBox.Bottom;
            }

            text.Append(word.Text + " ");
        }

        return text.ToString();
    }

    private void ExtractImages(Page page, StringBuilder markdown)
    {
        var images = page.GetImages();
        foreach (var image in images)
        {
            string filename = Path.GetRandomFileName();
            filename = Path.ChangeExtension(filename, ".png");

            if (useBase64)
            {
                byte[] bytes = image.RawBytes.ToArray();
                string base64 = Convert.ToBase64String(bytes);
                string mimeType = "image/png"; // Default

                // Determine format from image data
                if (bytes.Length > 2 && bytes[0] == 0xFF && bytes[1] == 0xD8) // JPEG header
                {
                    mimeType = "image/jpeg";
                }

                markdown.AppendLine($"![image](data:{mimeType};base64,{base64})\n");
            }
            else
            {
                if (string.IsNullOrEmpty(_imageOutputPath))
                {
                    _imageOutputPath = "images";
                }

                Directory.CreateDirectory(_imageOutputPath);
                string imagePath = Path.Combine(_imageOutputPath, filename);

                File.WriteAllBytes(imagePath, image.RawBytes.ToArray());
                markdown.AppendLine(
                    $"![image]({Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "images", filename)})\n");
            }
        }
    }

    private void ProcessParagraph(WordParagraph para, WordprocessingDocument doc, StringBuilder markdown,
        ref bool inList, ref int currentListLevel, ref string previousListId, ref int previousListLevel)
    {
        // Get paragraph style
        var style = para.ParagraphProperties?.ParagraphStyleId?.Val?.Value;
        var numProp = para.ParagraphProperties?.NumberingProperties;

        // Check if paragraph is empty
        if (!para.Descendants<Text>().Any() && !para.Descendants<Drawing>().Any() &&
            !para.Descendants<Break>().Any(b => b.Type == BreakValues.Page))
        {
            markdown.AppendLine();
            return;
        }

        // Handle page breaks
        if (para.Descendants<Break>()
            .Any(b => b.Type == BreakValues.Page))
        {
            // markdown.AppendLine("\n<!-- Page break -->\n");
        }

        // Handle headings
        if (style != null && style.StartsWith("Heading"))
        {
            inList = false; // End previous list
            int level = int.Parse(Regex.Match(style, @"\d+").Value);
            string headingText = ProcessFormattedText(para);
            markdown.AppendLine(new string('#', level) + " " + headingText + "\n");
        }
        // Handle lists
        else if (numProp != null)
        {
            var numId = numProp.NumberingId?.Val;
            var lvl = numProp.NumberingLevelReference?.Val ?? 0;

            if (numId != null)
            {
                var numbering = doc.MainDocumentPart.NumberingDefinitionsPart.Numbering;
                var numDef = numbering
                    .Elements<NumberingInstance>()
                    .FirstOrDefault(n => n.NumberID == numId);

                if (numDef != null)
                {
                    bool isBullet = IsNumberingStyleBullet(numbering, numDef, lvl);

                    // Handle list indentation and levels
                    if (!inList || numId.Value.ToString() != previousListId || lvl != previousListLevel)
                    {
                        // If not continuing previous list, add blank line
                        if (inList && (numId.Value.ToString() != previousListId || lvl < previousListLevel))
                        {
                            markdown.AppendLine();
                        }

                        inList = true;
                        previousListId = numId.Value.ToString();
                        previousListLevel = lvl;
                        currentListLevel = lvl;
                    }

                    string indent = new string(' ', currentListLevel * 2);
                    string prefix = isBullet ? "* " : ($"{(lvl + 1)}. ");
                    string listItemText = ProcessFormattedText(para);
                    markdown.AppendLine(indent + prefix + listItemText);
                }
            }
        }
        else
        {
            inList = false; // End previous list

            // Handle block quotes (usually indented paragraphs)
            int.TryParse(para.ParagraphProperties?.Indentation?.Left?.Value, out int indent);
            if (indent > 0)
            {
                string blockText = ProcessFormattedText(para);
                markdown.AppendLine("> " + blockText + "\n");
            }
            // Handle regular paragraphs
            else
            {
                string paragraphText = ProcessFormattedText(para);

                // Check for images in paragraph
                var drawings = para.Descendants<Drawing>();
                if (drawings.Any())
                {
                    foreach (var drawing in drawings)
                    {
                        var blip = drawing.Descendants<Blip>().FirstOrDefault();
                        if (blip != null)
                        {
                            var imageId = blip.Embed.Value;
                            var imagePart = doc.MainDocumentPart.GetPartById(imageId) as ImagePart;
                            if (imagePart != null)
                            {
                                string imageMarkdown = ProcessImage(imagePart);
                                markdown.AppendLine(imageMarkdown);
                            }
                        }
                    }
                }

                if (!string.IsNullOrWhiteSpace(paragraphText))
                {
                    markdown.AppendLine(paragraphText + "\n");
                }
            }
        }

        // Handle footnotes and endnotes
        var footnoteReferences = para.Descendants<FootnoteReference>();
        var endnoteReferences = para.Descendants<EndnoteReference>();

        if (footnoteReferences.Any() || endnoteReferences.Any())
        {
            // markdown.AppendLine("\n<!-- Document contains footnotes or endnotes -->\n");

            int footnoteCount = 1;
            foreach (var footnote in footnoteReferences)
            {
                var footnoteId = footnote.Id.Value;
                var footnotesPart = doc.MainDocumentPart.FootnotesPart;
                if (footnotesPart != null)
                {
                    var footnoteElement = footnotesPart.Footnotes.Elements<Footnote>()
                        .FirstOrDefault(f => f.Id.Value == footnoteId);

                    if (footnoteElement != null)
                    {
                        string footnoteText =
                            string.Join("", footnoteElement.Descendants<Text>().Select(t => t.Text));
                        markdown.AppendLine($"[^{footnoteCount}]: {footnoteText}");
                        footnoteCount++;
                    }
                }
            }
        }
    }

    private string ProcessFormattedText(WordParagraph para)
    {
        StringBuilder textBuilder = new StringBuilder();

        foreach (var run in para.Elements<Run>())
        {
            string runText = string.Join("", run.Elements<Text>().Select(t => t.Text));

            if (string.IsNullOrEmpty(runText)) continue;

            // Check text formatting
            var runProps = run.RunProperties;
            bool isBold = runProps?.Bold != null;
            bool isItalic = runProps?.Italic != null;
            bool isUnderline = runProps?.Underline != null;
            bool isStrike = runProps?.Strike != null;
            bool isHighlight = runProps?.Highlight != null;

            // Apply Markdown formatting
            if (isBold) runText = $"**{runText}**";
            if (isItalic) runText = $"*{runText}*";
            if (isStrike) runText = $"~~{runText}~~";
            if (isUnderline) runText = $"<u>{runText}</u>"; // HTML tag, supported by some Markdown parsers

            // Check for hyperlinks
            var hyperlink = run.Ancestors<Hyperlink>().FirstOrDefault();
            if (hyperlink != null)
            {
                string relationshipId = hyperlink.Id?.Value;
                if (!string.IsNullOrEmpty(relationshipId))
                {
                    var mainPart = (run.Ancestors<Document>().FirstOrDefault()?.MainDocumentPart);
                    if (mainPart != null)
                    {
                        var relationship =
                            mainPart.HyperlinkRelationships.FirstOrDefault(r => r.Id == relationshipId);
                        if (relationship != null)
                        {
                            string url = relationship.Uri.ToString();
                            runText = $"[{runText}]({url})";
                        }
                    }
                }
            }

            textBuilder.Append(runText);
        }

        return textBuilder.ToString();
    }

    private void ProcessTable(Table table, StringBuilder markdown)
    {
        // Get all rows
        var rows = table.Elements<TableRow>().ToList();
        if (!rows.Any()) return;

        // Determine column count (using first row)
        int columnCount = rows[0].Elements<TableCell>().Count();

        // Add header separator
        StringBuilder headerRow = new StringBuilder("|");
        StringBuilder separatorRow = new StringBuilder("|");

        for (int i = 0; i < columnCount; i++)
        {
            headerRow.Append(" |");
            separatorRow.Append(" --- |");
        }

        // Process header (assume first row is header)
        var firstRow = rows[0];
        markdown.Append("|");

        foreach (var cell in firstRow.Elements<TableCell>())
        {
            string cellText = string.Join("",
                cell.Descendants<Text>().Select(t => t.Text));
            // Process formatting in cells
            markdown.Append($" {cellText} |");
        }

        markdown.AppendLine();
        markdown.AppendLine(separatorRow.ToString());

        // Process data rows
        for (int i = 1; i < rows.Count; i++)
        {
            var row = rows[i];
            markdown.Append("|");

            foreach (var cell in row.Elements<TableCell>())
            {
                string cellText = string.Join("", cell.Descendants<Text>().Select(t => t.Text));
                // Handle merged cells
                var spanAttr = cell.TableCellProperties?.GridSpan?.Val;
                int span = spanAttr != null ? spanAttr.Value : 1;

                markdown.Append($" {cellText} |");

                // Add extra separators for merged cells
                for (int j = 1; j < span; j++)
                {
                    markdown.Append(" |");
                }
            }

            markdown.AppendLine();
        }

        markdown.AppendLine();
    }

    private bool IsNumberingStyleBullet(Numbering numbering, NumberingInstance numDef, int level)
    {
        var abstractNumId = numDef.AbstractNumId?.Val;
        if (abstractNumId != null)
        {
            var abstractNum = numbering.Elements<AbstractNum>()
                .FirstOrDefault(a => a.AbstractNumberId == abstractNumId);

            if (abstractNum != null)
            {
                var levelDef = abstractNum.Elements<Level>()
                    .FirstOrDefault(l => l.LevelIndex.Value == level);

                if (levelDef != null)
                {
                    var numFormat = levelDef.NumberingFormat?.Val;
                    return numFormat == NumberFormatValues.Bullet;
                }
            }
        }

        return false;
    }

    private string ProcessImage(OpenXmlPart imagePart)
    {
        string filename = Path.GetRandomFileName();
        string extension = imagePart.Uri.ToString().Split('.').Last();
        filename = Path.ChangeExtension(filename, extension);

        if (useBase64)
        {
            using var stream = imagePart.GetStream();
            using var ms = new MemoryStream();
            stream.CopyTo(ms);
            var imageBytes = ms.ToArray();
            var base64 = Convert.ToBase64String(imageBytes);
            var mimeType = GetMimeType(extension);
            return $"![image](data:{mimeType};base64,{base64})\n";
        }

        if (string.IsNullOrEmpty(_imageOutputPath))
        {
            _imageOutputPath = "images";
        }

        Directory.CreateDirectory(_imageOutputPath);
        string imagePath = Path.Combine(_imageOutputPath, filename);

        using (Stream stream = imagePart.GetStream())
        using (FileStream fs = new FileStream(imagePath, FileMode.Create))
        {
            stream.CopyTo(fs);
        }

        return $"![image]({Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "images", filename)})\n";
    }

    private string GetMimeType(string extension)
    {
        switch (extension.ToLower())
        {
            case "png": return "image/png";
            case "jpg":
            case "jpeg": return "image/jpeg";
            case "gif": return "image/gif";
            case "bmp": return "image/bmp";
            case "tiff":
            case "tif": return "image/tiff";
            case "emf": return "image/emf";
            case "wmf": return "image/wmf";
            default: return "application/octet-stream";
        }
    }

    private string ProcessHeadings(string text)
    {
        var lines = text.Split('\n');
        for (int i = 0; i < lines.Length; i++)
        {
            if (IsLikelyHeading(lines[i]))
            {
                lines[i] = "# " + lines[i];
            }
        }

        return string.Join("\n", lines);
    }

    private string ProcessLists(string text)
    {
        var lines = text.Split('\n');
        for (int i = 0; i < lines.Length; i++)
        {
            // Detect and convert bullet lists
            if (Regex.IsMatch(lines[i], @"^[\u2022\u2023\u2043\u204C\u204D\u2219\u25AA\u25CF\u25E6\u2981\u2999]"))
            {
                lines[i] = "* " + lines[i]
                    .TrimStart(
                        " \t\u2022\u2023\u2043\u204C\u204D\u2219\u25AA\u25CF\u25E6\u2981\u2999".ToCharArray());
            }
            // Detect and convert numbered lists
            else if (Regex.IsMatch(lines[i], @"^\d+[\.\)]"))
            {
                lines[i] = "1. " + Regex.Replace(lines[i], @"^\d+[\.\)]", "").Trim();
            }
        }

        return string.Join("\n", lines);
    }

    private string ProcessParagraphs(string text)
    {
        return Regex.Replace(text, @"([^\n])\n([^\n])", "$1\n\n$2");
    }

    // Helper class for table styles
    private class TableStyle
    {
        public string StyleId { get; set; }
        public string Name { get; set; }
    }
}