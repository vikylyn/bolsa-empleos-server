export interface IHabilidadService {
    // habilidades no asignadas a un curriculum
    listar(id_curriculum: number): any;
    // Talves No necesario 
    buscar(id: number): any;
    // habilidades no asignadas a un curriculum
 //   listarNoAsignadosCurriculum(id_curriculum: number):any;

} 