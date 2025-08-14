import { Component, ElementRef, ViewChild, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfileService, Profile } from '../../services/profile.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profile: Profile | null = null;
  loading = true;
  username = '';
  error = '';


  // Examples: http://localhost:4200/profile/hongmei-zhang
  // Examples: http://localhost:4200/profile/ashish-joshi

  constructor(private profileService: ProfileService, private router: Router) {
    // Subscribe to router events to handle navigation changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      // Extract username from URL
      const navigationEnd = event as NavigationEnd;
      const urlParts = navigationEnd.url.split('/');
      const username = urlParts[urlParts.length - 1];
      this.username = username;

      if (username && username !== 'test') {
        this.loadProfile(username);
      } else {
        // Load default profile for routes without username
        this.loadProfile('Hongmei-Zhang');
      }
    });
  }

  ngOnInit() {
    // Component initialization logic if needed
  }

  private loadProfile(username: string) {
    this.profileService.loadProfilesFromCSVFile().subscribe({
      next: (profiles) => {
        const foundProfile = this.profileService.findProfileByName(username);

        if (foundProfile) {
          this.profile = foundProfile;
          this.loading = false;
        } else {
          this.error = `Profile not found for: ${username}`;
          this.loading = false;
        }
      },
      error: (error) => {
        this.error = 'Failed to load profiles';
        this.loading = false;
      }
    });
  }

  // Helper methods for template
  getProfileName(): string {
    return this.profile?.name || 'Profile Not Found';
  }

  getProfileUserName(): string {
    return this.username;
  }

  getProfileEmail(): string {
    return this.profile?.email || '';
  }

  getProfilePhone(): string {
    return this.profile?.phone || '';
  }

  getProfileOffice(): string {
    return this.profile?.office || '';
  }

  getProfileTitle(): string {
    return this.profile?.title || '';
  }

  getProfileDivision(): string {
    return this.profile?.division || '';
  }

  getProfileBio(): string {
    return this.profile?.bio || '';
  }

  getProfileEducation(): string {
    return this.profile?.education || '';
  }

  getProfileLinkedIn(): string {
    return this.profile?.linkedin || '';
  }

  getProfileGoogleScholar(): string {
    return this.profile?.googleScholars || '';
  }
}
