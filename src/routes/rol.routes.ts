import {Router} from 'express';

import { listarRoles, buscarRoles, adicionarRoles, modificarRoles, borrarRoles } from '../controllers/rol.controller';

const rol = Router();

rol.get("/", listarRoles);

rol.get('/:id',buscarRoles); 

rol.post('/', adicionarRoles); 

rol.put('/:id', modificarRoles); 

 rol.delete('/:id', borrarRoles); 

export default rol;