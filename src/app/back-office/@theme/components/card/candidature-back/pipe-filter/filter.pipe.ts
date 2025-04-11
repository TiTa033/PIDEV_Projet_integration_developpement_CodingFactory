import { Pipe, PipeTransform } from '@angular/core';
import { User } from 'src/app/services/user.service';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(users: User[], searchTerm: string): User[] {
    if (!users || !searchTerm) {
      return users;
    }

    searchTerm = searchTerm.toLowerCase();

    return users.filter(user =>
      user.email.toLowerCase().includes(searchTerm)
    );
  }
}