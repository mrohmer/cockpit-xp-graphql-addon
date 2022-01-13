import {ServerSettings} from '$core/models/settings';

export const buildServerUrl = (server: ServerSettings, schema: 'ws://' | 'http://' = 'http://') => {
  const port = server.port ? `:${server.port}` : '';
  return `${schema}${server.host ?? 'localhost'}${(port) }/query`;
}

