import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Profile {
  name: string;
  image: string;
  education: string;
  title: string;
  group: string;
  division: string;
  office: string;
  phone: string;
  email: string;
  oldProfileLink: string;
  linkedin: string;
  googleScholars: string;
  bio: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  profiles: Profile[] = [];
  private nameLookup: Map<string, Profile> = new Map();

  constructor(private http: HttpClient) { }

  // read the data/sph-personnel-faculty.csv file
  readProfileFromCSVFile(): Observable<Profile[]> {
    const path = 'sph-personnel-faculty.csv';
    return this.http.get(path, { responseType: 'text' }).pipe(
      map(csvData => {
        const rows = csvData.split('\n');
        // console.log('CSV rows:', rows);
        
        // the first row is the header
        const header = rows[0];
        const headerArray = header.split(',');
        // console.log('CSV headers:', headerArray);
        
        // the rest of the rows are the data
        const data = rows.slice(1);
        // console.log('CSV data rows:', data);
        
        this.profiles = data
          .filter(row => row.trim() !== '') // Remove empty rows
          .map(row => this.parseCSVRow(row, headerArray));
        
        // Build name lookup map
        this.buildNameLookup();
        
        return this.profiles;
      })
    );
  }

  private parseCSVRow(row: string, headers: string[]): Profile {
    // Handle CSV parsing with proper comma handling (considering quotes)
    const values = this.parseCSVValues(row);
    
    return {
      name: values[0] || '',
      image: values[1] || '',
      education: values[2] || '',
      title: values[3] || '',
      group: values[4] || '',
      division: values[4] || '',
      office: values[5] || '',
      phone: values[6] || '',
      email: values[7] || '',
      oldProfileLink: values[8] || '',
      linkedin: values[9] || '',
      googleScholars: values[10] || '',
      bio: values[11] || ''
    };
  }

  private parseCSVValues(row: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    // Add the last value
    values.push(current.trim());
    
    return values;
  }

  private buildNameLookup(): void {
    this.nameLookup.clear();
    
    this.profiles.forEach(profile => {
      if (profile.name) {
        // Create lookup key by replacing spaces and special characters with dashes
        const nameKey = this.normalizeName(profile.name);
        this.nameLookup.set(nameKey.toLowerCase(), profile);
        
        // Also add the original name as a key
        this.nameLookup.set(profile.name.toLowerCase(), profile);
      }
    });
    
    // console.log('Name lookup map built:', this.nameLookup);
  }

  private normalizeName(fullName: string): string {
    // Remove any existing commas and extra spaces
    let normalized = fullName.replace(/,/g, '').trim();
    
    // Replace multiple spaces with single space
    normalized = normalized.replace(/\s+/g, ' ');
    
    // Replace spaces with dashes
    normalized = normalized.replace(/\s/g, '-');
    
    // Remove any special characters except dashes
    normalized = normalized.replace(/[^a-zA-Z0-9\-]/g, '');
    
    return normalized;
  }

  loadProfilesFromCSVFile(): Observable<Profile[]> {
    return this.readProfileFromCSVFile();
  }

  findProfileByName(nameQuery: string): Profile | undefined {
    const normalizedQuery = nameQuery.toLowerCase().trim();
    return this.nameLookup.get(normalizedQuery);
  }

  findProfile(username: string): Profile | undefined {
    return this.findProfileByName(username);
  }

  getProfile(): Profile[] {
    return this.profiles;
  }
}
