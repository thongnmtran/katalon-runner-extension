const EventName = {
  connection: 'connection',
  connect: 'connect',
  connectError: 'connect_error',
  disconnect: 'disconnect',
  log: 'log',
  sendTo: 'sendTo',
  getInstances: 'getInstances',
  setInstances: 'setInstances',
  startNewInstance: 'startNewInstance',
  registerInstance: 'registerInstance',
  run: 'run',
  stop: 'stop',

  // Vscode
  test: 'test',
  loaded: 'loaded',
  message: 'message',
  update: 'update',
  setSteps: 'setSteps',
  setLogs: 'setLogs',
  setTheme: 'setTheme',
  setOnline: 'setOnline',
  openScript: 'openScript',
  closeScript: 'closeScript',
  setScriptOpened: 'setScriptOpened'
};

module.exports = EventName;
