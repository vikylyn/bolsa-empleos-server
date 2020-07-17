import { Container } from "inversify";
import { TYPES } from "./types";
import { IRolService } from '../src/interfaces/rol.service';
import { RolRepository } from '../src/repositories/rol.repository'; 
import { IAdministradorService } from '../src/interfaces/administrador.service';
import { AdministradorRepository } from '../src/repositories/administrador.repository'
import { ICredencialesService } from '../src/interfaces/creadenciales.service';
import { CredencialesRepository } from "../src/repositories/credenciales.repository";
import { IAreaLaboralService } from '../src/interfaces/area-laboral.service';
import { AreaLaboralRepository } from "../src/repositories/area-laboral.repository";
import { IProfesionService } from '../src/interfaces/profesion.service';
import { ProfesionRepository } from "../src/repositories/profesion.repository";

const myContainer = new Container();

myContainer.bind<IRolService>(TYPES.IRolService).to(RolRepository);
myContainer.bind<IAdministradorService>(TYPES.IAdministradorService).to(AdministradorRepository);
myContainer.bind<ICredencialesService>(TYPES.ICredencialesService).to(CredencialesRepository);
myContainer.bind<IAreaLaboralService>(TYPES.IAreaLaboralService).to(AreaLaboralRepository);
myContainer.bind<IProfesionService>(TYPES.IProfesionService).to(ProfesionRepository);   


export { myContainer };    