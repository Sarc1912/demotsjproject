export interface RequestListInterface {
    encabezado: Encabezado;
    solicitante: Solicitante;
    representado: Representado;
    agraviante: Agraviante;
    hechos: Hechos;
    juridicos: Juridicos;
    cautelares: Cautelares;
    recaudos: Recaudos;
    declaracion: Declaracion;
  }

  export interface Agraviante {
    nombre: string;
    cargo: string;
    domicilio: string;
    telefono: string;
    correo: string;
  }

  export interface Cautelares {
    medidas: string;
  }

  export interface Declaracion {
    abogado: string;
    inpreabogado: string;
    fecha: Date;
  }

  export interface Encabezado {
    tribunal: string;
    expediente: string;
  }

  export interface Hechos {
    narrativa: string;
    circunstancias: string;
    derechos: string;
  }

  export interface Juridicos {
    normas: string;
    jurisprudencia: string;
    solicitudes: string;
  }

  export interface Recaudos {
    cedula: Cedula;
    documentos: Cedula;
  }

  export interface Cedula {
    "0": string;
  }


  export interface Representado {
    nombre: string;
    apellido: string;
    cedula: string;
    relacion: string;
  }

  export interface Solicitante {
    nombre: string;
    apellido: string;
    tipoDoc: string;
    cedula: string;
    estadoCivil: string;
    domicilio: string;
    telefonoCelular: string;
    telefonoLocal: string;
    correo: string;
    condicion: string;
  }
