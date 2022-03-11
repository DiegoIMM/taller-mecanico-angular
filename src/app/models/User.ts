export class User {
  id?: number | null;
  name: string;
  username: string;
  email: string;
  profile_picture?: string;


  constructor(name: string, username: string, email: string, profile_picture?: string, id?: number) {
    this.id = id ? id : null;
    this.name = name;
    this.username = username;
    this.email = email;
    this.profile_picture = profile_picture ? profile_picture : '';

  }


//  crear un User desde un json
  static fromJson(json: any): User {
    return new User(
      json.name,
      json.username,
      json.email,
      json.profile_picture,
      json.id
    );
  }


//  crear un json desde un User
  toJson(): any {
    return {
      name: this.name,
      username: this.username,
      email: this.email,
      profile_picture: this.profile_picture,
      id: this.id
    };
  }


}
