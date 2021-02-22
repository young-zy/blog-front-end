import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { UserService } from '../common/user.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy{

  public Themes = Themes;

  public currentTheme = '';

  public isLoggedIn = false;
  private loginStateSubscriber: Subscription | undefined;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              @Inject(DOCUMENT) private document: Document,
              private location: Location,
              private userService: UserService) {}

  changeTheme(themeName: string): void {
    console.log(themeName);
    if (this.currentTheme !== ''){
      this.document.body.classList.replace(this.currentTheme, themeName);
    } else {
      this.document.body.classList.add(themeName);
    }
    this.currentTheme = themeName;
    window.localStorage.setItem('theme', themeName);
  }

  openLoginDialog(): void {
    this.dialog.open(LoginDialogComponent, {
      width: '300px',
      height: '270px'
    });
  }

  get isRoot(): boolean {
    return this.location.isCurrentPathEqualTo('/question');
  }

  backClicked(): void{
    console.log('back button clicked');
    this.location.back();
  }

  ngOnInit(): void {
    this.loginStateSubscriber = this.userService.loginState.subscribe(
      next => this.isLoggedIn = next
    );
    this.currentTheme = window.localStorage.getItem('theme') || this.Themes.indigoPink;
    this.document.body.classList.add(this.currentTheme);
  }

  ngOnDestroy(): void {
    this.loginStateSubscriber?.unsubscribe();
  }
}

enum Themes{
  indigoPink = 'indigo-pink',
  blueGray = 'blue-gray'
}
