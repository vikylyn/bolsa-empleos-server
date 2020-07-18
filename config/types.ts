import { ISolicitanteService } from '../src/interfaces/solicitante.service';
const TYPES = {
    IRolService: Symbol.for("IRolService"),
    IAdministradorService: Symbol.for("IAdministradorService"),
    ICredencialesService: Symbol.for("ICredencialesService"),
    IAreaLaboralService: Symbol.for("IAreaLaboralService"),
    IProfesionService: Symbol.for("IProfesionService"),
    ISolicitanteService: Symbol.for("ISolicitanteService")  
}

export { TYPES };    