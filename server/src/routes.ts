import express from 'express'
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';
import OperatorsController from './controllers/OperatorsController';

const routes = express.Router();

const classesControllers = new ClassesController()
const connectionsControlles = new ConnectionsController()
const operatorsControlles = new OperatorsController()

routes.get('/classes', classesControllers.index)
routes.post('/classes', classesControllers.create)

routes.post('/connections', connectionsControlles.create)
routes.get('/connections', connectionsControlles.index)

routes.post('/operators', operatorsControlles.create)
routes.get('/operators', operatorsControlles.index)
routes.post('/login', operatorsControlles.login)

export default routes;