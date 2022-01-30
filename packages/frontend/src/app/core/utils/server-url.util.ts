import {ServerSettings} from '$core/models/settings';

export const buildServerUrl = (server: ServerSettings) => {
  const port = server.port ? `:${server.port}` : '';
  return `http://${server.host ?? 'localhost'}${(port) }/query`;
}

