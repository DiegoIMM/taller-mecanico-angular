export class User {
  //TODO: Ajustar al modelo de la bdd


  id?: number | null;
  users: string;
  pass: string;
  rol: string;
  habilitado: number;
  empresa: Empresa;


  constructor(users: string, pass: string, rol: string, habilitado: number, empresa: Empresa, id?: number) {
    this.id = id ? id : null;
    this.users = users;
    this.pass = pass;
    this.rol = rol;
    this.empresa = empresa;
    this.habilitado = habilitado;

  }


//  crear un User desde un json
  static fromJson(json: any): User {
    return new User(
      json.users,
      json.pass,
      json.rol,
      json.habilitado,
      json.empresa,
      json.id
    );
  }


//  crear un json desde un User
  toJson(): any {
    return {
      users: this.users,
      pass: this.pass,
      rol: this.rol,
      habilitado: this.habilitado,
      empresa: this.empresa,
      id: this.id
    };


  }
}

interface Empresa {
  id?: number | null;
  nombre: string;
  direccion: string;
  rut: string;
}


