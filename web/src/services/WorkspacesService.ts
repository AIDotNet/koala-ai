import { postJson, get, putJson, del } from '../utils/request';

const prefix = '/api/v1/workspaces';

export async function createWorkspace(data: any) {
  return postJson(`${prefix}`, data);
}

export async function getWorkspaces() {
  return get(`${prefix}`);
}

export async function updateWorkspace(id: number, data: any) {
  return putJson(`${prefix}/${id}`, data);
}

export async function deleteWorkspace(id: number) {
  return del(`${prefix}/${id}`);
}