import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RequestService } from '../services/request.service';
import { MechanicShellHeaderComponent } from '../mechanic-shell-header/mechanic-shell-header.component';

@Component({
  selector: 'app-mechanic-history',
  standalone: true,
  imports: [CommonModule, MechanicShellHeaderComponent],
  templateUrl: './mechanic-history.component.html',
  styleUrls: ['./mechanic-history.component.scss']
})
export class MechanicHistoryComponent
  implements OnInit {

  allJobs: any[] = [];
  paginatedJobs: any[] = [];

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;

  constructor(
    private requestService: RequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory() {
    this.requestService
      .getMechanicHistory()
      .subscribe({
        next: (res: any[]) => {
          this.allJobs = res || [];
          this.totalPages = Math.ceil(
            this.allJobs.length / this.itemsPerPage
          );
          this.updatePagination();
        }
      });
  }

  updatePagination() {
    const start =
      (this.currentPage - 1) * this.itemsPerPage;

    const end =
      start + this.itemsPerPage;

    this.paginatedJobs =
      this.allJobs.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  goBack() {
    this.router.navigate(['/mechanic-dashboard']);
  }
}