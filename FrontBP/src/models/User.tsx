export class User {
  korIme: string;
  email: string;
  lozinka: string;
  ime: string;
  prezime: string;
  datumRodjenja: Date;
  adresa: string;
  slika: string;

  constructor() {
    this.korIme = "";
    this.email = "";
    this.lozinka = "";
    this.ime = "";
    this.prezime = "";
    this.datumRodjenja = new Date();
    this.adresa = "";
    this.slika = "";
  }
}
