import { get } from "@/utils/request";


const getModelList = () => {
  return get('/config/model.json');
};

export { getModelList };
