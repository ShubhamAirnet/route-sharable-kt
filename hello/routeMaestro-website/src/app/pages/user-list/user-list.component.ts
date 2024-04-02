import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';


interface PeriodicElement {
  position:Number;
  name: string;
  phone: number;
  email: string;
  
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen',  phone: 1.0079,  email: 'H'},
  {position: 2, name: 'Helium',  phone: 4.0026,  email: 'He'},
  {position: 3, name: 'Lithium',  phone: 6.941,  email: 'Li'},
  {position: 4, name: 'Beryllium',  phone: 9.0122,  email: 'Be'},
  {position: 5, name: 'Boron',  phone: 10.811,  email: 'B'},
  {position: 6, name: 'Carbon',  phone: 12.0107,  email: 'C'},
  {position: 7, name: 'Nitrogen',  phone: 14.0067,  email: 'N'},
  {position: 8, name: 'Oxygen',  phone: 15.9994,  email: 'O'},
  {position: 9, name: 'Fluorine',  phone: 18.9984,  email: 'F'},
  {position: 10, name: 'Neon',  phone: 20.1797,  email: 'Ne'},
];

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
 
})
export class UserListComponent implements OnInit {
  search: string = '';
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  users:any |null=null;
  index:number=0;

  constructor(private authService: AuthService,) { 
    this.fetchUserDetails()
  }

  ngOnInit(): void {
  }

  onSearchChange(event :any): void {
    const searchTerm = this.search.toLowerCase();
    this.dataSource = ELEMENT_DATA.filter(
      (element) =>
        element.name.toLowerCase().includes(searchTerm) ||
        element.email.toLowerCase().includes(searchTerm)
    );
  }

  
  async fetchUserDetails(): Promise<void> {
    console.log("fetching");
    
    try {
      const userDetails = await this.authService.getAllUserDetails();
      console.log(userDetails)
  
        this.users= userDetails;
        console.log(this.users);
        // sorting the values so that it will have the same order everytime
       

      
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }

}
