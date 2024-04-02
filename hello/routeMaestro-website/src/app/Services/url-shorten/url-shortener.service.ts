import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import axios from 'axios';
@Injectable({
  providedIn: 'root'
})
export class UrlShortenerService {
  private apiUrl = "https://api.rebrandly.com/v1/links";
  private apiKey='5966738893e243e3a182f020c2a5d743'
  private workspaceId = 'e6b09d62af77432693701addcf01f1d1'; // Replace with your Bitly access token


  constructor(private http: HttpClient) {}

  async shorten(url: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'apikey': this.apiKey,
      'workspace': this.workspaceId,
    });

    const linkRequest = {
      destination: url,
      domain: { fullName: 'rebrand.ly' },
      // slashtag: 'A_NEW_SLASHTAG',
      // title: 'Rebrandly YouTube channel',
    };

    const apiCall = {
      method: 'post',
      url: this.apiUrl,
      data: linkRequest,
      headers: headers,
    };
    try {
      const apiResponse = await axios.post(this.apiUrl, linkRequest, {
         headers:{
          'Content-Type': 'application/json',
          'apikey': this.apiKey,
          'workspace': this.workspaceId,
         } });
      const link = apiResponse.data;
      return link.shortUrl;
    } catch (error) {
      console.error('Error shortening URL:', error);
      // Handle error as needed
      throw error;
    }
    return this.http.post<any>(apiCall.url, apiCall.data, { headers: apiCall.headers });
  }
}
