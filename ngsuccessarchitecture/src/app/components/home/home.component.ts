import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  ENGLISH: boolean;
  ARABIC: boolean;
  userlanguage: string = undefined;
  userrole: string = undefined;
  username: string = undefined;
  realname: string = undefined;
  USER: boolean;
  ADMIN: boolean;
  CUSTOMER: boolean;
  subscription: Subscription;
  items: Array<any> = [];

  constructor(private authService: AuthService,
    private router: Router
    ) {
      this.items = [
        // 1
          {title: 'Master Success Architecture in Health, Self Healing & Well Being',
          img: 'assets/images/superhero-534121.jpg',
          // tslint:disable-next-line:max-line-length
          description: 'Discover a diet worthy of your mind, brain, body connection. A diet that maximizes your core energy and strength. Our body weight is yet another marvelous example of Success Architecture balance or Homeostasis working in our bodies to maintain proper weight. As you may know our brain main purpose is survival. It relentlessly strives day in and day out to keep us alive. Maintaining a healthy body weight properly requires the control and manipulation of a very large number of variables. In our Success Architecture control module these variables come together and resolve their value differences to maintain a settling body weight. Then our brain and the intelligence in our bodies maintain this weight and defend it against change. This body weight depends on...',
          link: '/well'},
        // 3
          {title: 'Master Success Architecture in Learning, Study & Teaching Skills',
          img: 'assets/images/woman-945427.jpg',
          // tslint:disable-next-line:max-line-length
          description: 'Learn the strategies, thinking and mental tools that scientists used to gain knowledge throughout history. What is the role of Success Architecture primal mechanisms and how can you use it at Acquiring know how. What are the bases of success? How can you design and build strong personality? How to acquire better grades? Do your homework and face tests without anxiety or worry. Break the fear and the pressure when perusing major milestones. Concentrate and prevent mind shattering that happens to all of us. Learn usable organizing tools? Maximize your mind energies to serve your purpose. What is thinking, creativity, innovation and how to use them to succeed at school and life? What are our learning mental patterns? How can our Brain memorize this vast amount of information...',
          link: '/study'},
        // 4
          {title: 'Join Daily "Feel the Chi" Practice group in Ba Duan Jin Chi Gong',
          img: 'assets/images/fu-3624167.jpg',
          // tslint:disable-next-line:max-line-length
          description: 'Learn the eight pieces of brocade exercises to open your body’s energy pathways and help your personal transformation. Awaken your body’s healing potential and experience how energy flows within your body. Research has shown that doing these “pieces of jewels”, greatly reduces stress, and promotes self healing. As you part take in our daily meditative movements, your experience becomes your story to share and to teach to others. Developed by Success Architecture Founder to fulfill the cleansing and stress relieve components of living a healthy, happy, and successful life. This development came about after practicing this art for more than 12 years with prominent teachers in the Fareast. The practice is segmented into 10 weeks of daily easy exercise flows. Each weekly segment is 5 hourly daily sessions.',
          link: '/chi'},
        // 5
          {title: 'Fast Track Master Success Architecture in our North Thailand Boot Camp',
          img: 'assets/images/woman-1820868.jpg',
          // tslint:disable-next-line:max-line-length
          description: 'We swim upstream against a great torrent of disorganization, which tends to reduce everything to the heat death of equilibrium and sameness; Norbert Wiener 1894 –1964  in his book Cybernetics. The one most important discovery that you will make in Success Architecture is that your current balance is not only shaped by your mind and will, but is also a result of the influential forces of your environment. The social, economical, creative, professional, and all other areas of your life are in equilibrium. A creativity tool that we will learn in Success Architecture is that an escape from these forces is necessary for change. Our fast track boot camp in the wonderful northern area of Thailand will do just that for you. We offer you one month concentrated training in Organizational Innovation or Well Being.',
          link: '/camp'},
        // 6 shop online
          {title: 'Master Success Architecture in Health, Self Healing & Well Being',
          img: 'assets/images/superhero-534121.jpg',
          // tslint:disable-next-line:max-line-length
          description: 'Discover a diet worthy of your mind, brain, body connection. A diet that maximizes your core energy and strength. Our body weight is yet another marvelous example of Success Architecture balance or Homeostasis working in our bodies to maintain proper weight. As you may know our brain main purpose is survival. It relentlessly strives day in and day out to keep us alive. Maintaining a healthy body weight properly requires the control and manipulation of a very large number of variables. In our Success Architecture control module these variables come together and resolve their value differences to maintain a settling body weight. Then our brain and the intelligence in our bodies maintain this weight and defend it against change. This body weight depends on...',
          link: '/well'},
        // 7 book a training session online
        // 8 watch our youtube channel and interviews
          {title: 'Master Success Architecture in Learning, Study & Teaching Skills',
          img: 'assets/images/woman-945427.jpg',
          // tslint:disable-next-line:max-line-length
          description: 'Learn the strategies, thinking and mental tools that scientists used to gain knowledge throughout history. What is the role of Success Architecture primal mechanisms and how can you use it at Acquiring know how. What are the bases of success? How can you design and build strong personality? How to acquire better grades? Do your homework and face tests without anxiety or worry. Break the fear and the pressure when perusing major milestones. Concentrate and prevent mind shattering that happens to all of us. Learn usable organizing tools? Maximize your mind energies to serve your purpose. What is thinking, creativity, innovation and how to use them to succeed at school and life? What are our learning mental patterns? How can our Brain memorize this vast amount of information...',
          link: '/study'},
      ];
    }

  ngOnInit() {
    this.authService.loadUserLanguage();
    this.subscription = this.authService.getUserlanguage()
      .subscribe(
        lang => {
          console.log('home lang ', lang);
            this.userlanguage = lang;
          if (this.userlanguage === 'english') {
            this.ENGLISH = true;
            this.ARABIC = false;
          } else if (this.userlanguage === 'arabic') {
            this.ARABIC = true;
            this.ENGLISH = false;
          }
        });
        this.authService.loadUserCredentials();
        this.subscription = this.authService.getUserrole()
        .subscribe(
          role => {
            this.userrole = role;
            if (role === undefined) {
              this.USER = true;
              this.CUSTOMER = false;
              this.ADMIN = false;
            } else if (role === 'CUSTOMER') {
              this.USER = false;
              this.CUSTOMER = true;
              this.ADMIN = false;
            } else if (role === 'ADMIN') {
              this.ADMIN = true;
              this.USER = false;
              this.CUSTOMER = false;
            }
            // tslint:disable-next-line:max-line-length
            console.log('role this.USER this.ADMIN this.CUSTOMER', role, this.USER, this.ADMIN, this.CUSTOMER);
          });
        this.subscription = this.authService.getRealname()
        .subscribe(
          realname => {
            this.realname = realname;
            console.log('realname ', realname);
          });
        this.subscription = this.authService.getUsername()
        .subscribe(
          username => {
            this.username = username;
            console.log('username ', username);
          });
  }

}
