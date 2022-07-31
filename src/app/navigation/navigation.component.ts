import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT, Location } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserService } from '../common/user.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { TitleService } from '../common/title.service';
import { User } from '../common/entities/user';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  imports: [
    MatDialogModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    FlexLayoutModule,
    MatRadioModule,
    CommonModule,
    MatButtonModule,
    MatTooltipModule,
    RouterModule,
    FooterComponent,
    MatCardModule
  ],
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {

  public Themes = Themes;

  public currentTheme = '';

  public title = '';

  public user: User | undefined;

  public loginState$: Observable<boolean>;

  public selfInfo$: Observable<User>;

  private titleSubscription: Subscription | undefined;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              @Inject(DOCUMENT) private document: Document,
              private titleService: TitleService,
              private location: Location,
              private userService: UserService,
              private overlayContainer: OverlayContainer) {
    this.loginState$ = this.userService.loginState$;
    this.selfInfo$ = this.userService.selfInfo$;
  }

  get avatar(): Observable<string> {
    return this.selfInfo$.pipe(map<User, string>(user => user.avatar === '' ? 'assets/avatar.webp' : user.avatar));
  }

  changeTheme(themeName: string): void {
    if (this.currentTheme !== '') {
      this.overlayContainer.getContainerElement().classList.replace(this.currentTheme, themeName);
      this.document.body.classList.replace(this.currentTheme, themeName);
    } else {
      this.document.body.classList.add(themeName);
      this.overlayContainer.getContainerElement().classList.add(themeName);
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

  backClicked(): void {
    console.log('back button clicked');
    this.location.back();
  }

  logoutClicked(): void {
    this.userService.logout();
  }

  ngOnInit(): void {
    this.titleSubscription = this.titleService.currentTitle.subscribe(next => {
      this.title = next;
    });
    this.currentTheme = window.localStorage.getItem('theme') || this.Themes.indigoPink;
    this.document.body.classList.add(this.currentTheme);
    this.overlayContainer.getContainerElement().classList.add(this.currentTheme);
  }

  ngOnDestroy(): void {
    this.titleSubscription?.unsubscribe();
  }
}

enum Themes{
  indigoPink = 'indigo-pink',
  blueGray = 'blue-gray',
  black = 'black'
}
