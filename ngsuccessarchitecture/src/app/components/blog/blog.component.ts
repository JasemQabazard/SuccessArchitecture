import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray , Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { Blog, Comment, BlogCategory, DraftBlog, awsMediaPath } from '../../shared/blog';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit, OnDestroy {
  fb: FormGroup;  // initial profile input form control
  addEditPost: boolean;
  diet: boolean;  // used to be support
  chi: boolean; // used to be retail
  innovation: boolean;  // used to be openInnovation
  all: boolean; // used to be ZarioCrypto
  btnDiet = 'btn-outline-warning';
  btnAddEditPost = 'btn-link';
  btnCHI = 'btn-link';
  btnInnovation = 'btn-link';
  btnAll = 'btn-link';
  category: string;
  dataModel: string;
  notUpdated: boolean;
  commentNotUpdated = true;
  blogcategories: BlogCategory[];
  blogs: Blog[];
  xblogs: Blog[];
  displayedBlogs: Array<Blog> = new Array(3);
  displayedBlogsNDX: number;
  currentlyDisplayed: Blog;
  currentlyDisplayedNDX = 0;
  blog: Blog;
  comment: Comment;
  _bid = '';
  _cid = '';
  _uid = '';
  selectedMediaFile = null;
  selectedMediaFileName = 'No Media Selected';
  mediaPath = awsMediaPath + 'blog-movement-2203657.png';
  mediaChanged = false;
  draftblog: DraftBlog = new DraftBlog;
  blogKey: string;
  subscription: Subscription;
  username: string = undefined;
  userrole: string = undefined;
  realname: string = undefined;
  message: string;
  messageClass: string;
  NEXT = false;
  PREVIOUS = false;
  LOCALSTORAGE = false;
  iHate = false;
  iLove = true;
  komment: string;
  noProfile = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService,
    private router: Router
  ) {
    this.createfb();
  }

  ngOnInit() {
    this.addEditPost = false;
    this.diet = false;
    this.chi = false;
    this.innovation = false;
    this.all = false;
    this.komment = '';
    this.dataModel = '';
    this.notUpdated = true;
    this.blogKey = 'BLOG';
    this.draftblog = {
      _id: '',
      username: '',
      media: '',
      category: '',
      title: '',
      post: ''
    };
    for (let j = 0; j < 3; j++) {
      this.displayedBlogs[j] = {
        _id: '',
        username: '',
        media: '',
        category: '',
        title: '',
        post: '',
      };
    }
    this.currentlyDisplayed = this.displayedBlogs[0];
    this.blogcategories = [
      {blogcategoryname: 'diet'},
      {blogcategoryname: 'chi'},
      {blogcategoryname: 'innovation'}
    ];
    this.authService.loadUserCredentials();
    // get all blogs
    this.blogService.getBlogs()
    .subscribe(blogs => {
      this.blogs = blogs;
      console.log('%c get all blogs in the system: ', 'background: #222; color: #bada55', blogs);
      setTimeout(() => {
        if (this.username === undefined) {
          console.log('&c 1- changecategory at blog read time out', 'background: #222; color: #bada55');
          this.changeCategory('diet');
        }
      }, 1000);
      this.subscription = this.authService.getRealname()
      .subscribe(
        rname => {
          this.realname = rname;
        });
      this.subscription = this.authService.getUsername()
      .subscribe(
        name => {
          if (name !== '') {
            this.username = name;
            const draft: DraftBlog = this.loadDraftBlog();
            if (draft === null) {
              console.log('$c NO DRAFT BLOG EXISTS ', 'background: #222; color: #bada55');
            } else {
              this.draftblog = draft;
              this._bid = this.draftblog._id;
              this.LOCALSTORAGE = true;
              this.fb.setValue({
                blogcategory: this.draftblog.category
              });
              if (this.draftblog.media !== '') {
                this.mediaPath = awsMediaPath + this.draftblog.media;
              }
            }
            this.authService.getUser(this.username)
            .subscribe(user => {
              this.userrole = user.role;
              this._uid = user._id;
              console.log('%c 5- changecategory at userrole admin probably', 'background: #222; color: #bada55', this.userrole);
              this.changeCategory('diet');
            });
          }
        });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createfb() {
    this.fb = this.formBuilder.group({
      blogcategory: 'diet'
    });
    this.onChanges();
  }
  onChanges(): void {
    this.fb.valueChanges.subscribe(val => {
      this.notUpdated = false;
    });
  }

  changeCategory(category) {
    if (this.category !== category) {
      this.btnDiet = 'btn-link';
      this.btnAddEditPost = 'btn-link';
      this.btnCHI = 'btn-link';
      this.btnInnovation = 'btn-link';
      this.btnAll = 'btn-link';
      this.category = category;
      if (this.category === 'Add Edit Post') {
        this.addEditPost = true;
        this.btnAddEditPost = 'btn-outline-warning';
      } else {
        if (category === 'diet') {
          this.btnDiet = 'btn-outline-warning';
        } else if (category === 'chi') {
          this.btnCHI = 'btn-outline-warning';
        } else if (category === 'innovation') {
          this.btnInnovation = 'btn-outline-warning';
        } else if (category === 'all') {
          this.btnAll = 'btn-outline-warning';
        }
        this.addEditPost = false;
        this.displayedBlogsNDX = 0;
        this.xblogs = [];
        if (category === 'all') {
          this.xblogs = this.blogs;
        } else {
          this.xblogs = this.blogs.filter( (b) => {
            return b.category === this.category;
           });
        }
        console.log('during Change Category this.xblogs, this.blogs', this.xblogs, this.blogs);
        this.prepareBlogDisplay();
      }
    }
  }

  prepareBlogDisplay() {
    let no = 0;
    for (let j = 0; j < 3; j++) {
      this.displayedBlogs[j] = {
        _id: '',
        username: '',
        media: '',
        category: '',
        title: '',
        post: ''
      };
    }
    for ( let i = this.displayedBlogsNDX; i < this.xblogs.length; i++) {
      if (no === 3) {
        break;
      } else {
        this.displayedBlogs[no] = Object.assign({}, this.xblogs[i]);
        this.displayedBlogs[no].media = awsMediaPath + this.displayedBlogs[no].media;
        no++;
        this.displayedBlogsNDX++;
      }
    }
    this.currentlyDisplayed = this.displayedBlogs[0];
    this.currentlyDisplayedNDX = 0;
    if (this.xblogs.length !== 0) {
      this.setHateLove();
    }
    this._cid = '';
    this.komment = '';
    this.commentNotUpdated = true;
    if (this.displayedBlogsNDX < this.xblogs.length) {
      this.NEXT = true;
    } else {
      this.NEXT = false;
    }
    if (this.displayedBlogsNDX <= 3) {
      this.PREVIOUS = false;
    } else {
      this.PREVIOUS = true;
    }
    if (this.displayedBlogsNDX === 0) {
      this.PREVIOUS = false;
      this.NEXT = false;
    }
  }

  mediaFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedMediaFile = event.target.files[0];
      console.log(this.selectedMediaFile, this.selectedMediaFile.size);
      this.displayMediaFile();
    }
  }

  displayMediaFile() {
    if (this.selectedMediaFile.size < 2000000) {
      this.mediaChanged = true;
      this.message = '';
      this.messageClass = '';
    } else {
      this.mediaChanged = false;
      this.message = 'Please Choose a File size < 2MByte';
      this.messageClass = 'alert alert-danger';
    }
    this.selectedMediaFileName = 'Image selected but not Uploaded';
    function imageExists(url, callback) {
      const img = new Image();
      img.onload = function() { callback(true); };
      img.onerror = function() { callback(false); };
      img.src = url;
    }
    const reader = new FileReader();
    reader.onload = (event: any) => {
      imageExists(event.target.result, (exists) => {
        if (exists) {
          this.mediaPath = event.target.result;
        } else {
          this.selectedMediaFileName = 'Your selection is not an Image File';
          this.mediaPath = awsMediaPath + 'blog-movement-2203657.png';
        }
      });
    };
    reader.readAsDataURL(this.selectedMediaFile);
  }

  uploadMediaFile() {
    const fileext = this.selectedMediaFile.type.slice(this.selectedMediaFile.type.indexOf('/') + 1);
    const specs = this._uid + fileext;
    this.blogService.postAWSMediaURL(specs)
              .subscribe(uploadConfig => {
                this.blogService.putAWSMedia(uploadConfig.url , this.selectedMediaFile)
                .subscribe(resp => {
                  this.mediaPath = awsMediaPath + uploadConfig.key;
                  this.draftblog.media = uploadConfig.key;
                  this.selectedMediaFileName = '';
                  this.mediaChanged = false;
                  this.changeNotUpdated();
                },
                errormessage => {
                  console.log('postAWSMediaURL error--->message', errormessage);
                });
        });
  }

  saveDraft() {
    this.draftblog.category = this.fb.controls['blogcategory'].value;
    this.draftblog.username = this.username;
    this.storeDraftBlog();
    this.LOCALSTORAGE = true;
  }

  cancelDraftPost() {
    localStorage.removeItem(this.blogKey);
    this.LOCALSTORAGE = false;
  }

  publish() {
    this.blog = {
      username: this.username,
      media: this.draftblog.media,
      category: this.fb.controls['blogcategory'].value,
      title: this.draftblog.title,
      post: this.draftblog.post,
    };
    this.blogService.addBlog(this.blog).subscribe(
      data => {
        this.messageClass = 'alert alert-success';
        this.message = 'Blog Add Successfull';
        this.fb.reset();
        this.fb.setValue ({
          blogcategory: 'diet'
        });
        if (this.LOCALSTORAGE) {
          this.cancelDraftPost();
        }
        this.draftblog = {
          _id: '',
          username: '',
          media: '',
          category: '',
          title: '',
          post: '',
        };
        this.selectedMediaFileName = 'No Media Selected';
        this.mediaPath = awsMediaPath + 'blog-movement-2203657.png';
        this.blogs.push(data);
        this.notUpdated = true;
      });
  }

  updatePost() {
    this.blog = {
      username: this.username,
      media: this.draftblog.media,
      category: this.fb.controls['blogcategory'].value,
      title: this.draftblog.title,
      post: this.draftblog.post
    };
    this.blogService.updateBlog(this._bid, this.blog).subscribe(
      data => {
        this.messageClass = 'alert alert-success';
        this.message = 'Blog Update Successfull';
        this.fb.reset();
        this.fb.setValue ({
          blogcategory: 'diet'
        });
        if (this.LOCALSTORAGE) {
          this.cancelDraftPost();
        }
        this.draftblog = {
          _id: '',
          username: '',
          media: '',
          category: '',
          title: '',
          post: ''
        };
        const ndx = this.blogs.findIndex((b) => {
          return b._id === this._bid;
        });
        this._bid = '';
        this.selectedMediaFileName = 'No Media Selected';
        this.mediaPath = awsMediaPath + 'blog-movement-2203657.png';
        this.blogs[ndx] = data;
        console.log('during-blogUpdate ndx, data, blogs[ndx] ', ndx, data, this.blogs[ndx]);
        this.notUpdated = true;
      });
  }

  loadDraftBlog(): DraftBlog {
    let blog: DraftBlog;
    blog = JSON.parse(localStorage.getItem(this.blogKey));
    return blog;
  }

  storeDraftBlog() {
    localStorage.setItem(this.blogKey, JSON.stringify(this.draftblog));
  }

  editBlogPost() {
    this.draftblog = {
      _id: this.currentlyDisplayed._id,
      username: this.currentlyDisplayed.username,
      media: this.currentlyDisplayed.media.substring(60),
      category: this.currentlyDisplayed.category,
      title: this.currentlyDisplayed.title,
      post: this.currentlyDisplayed.post
    };
    this._bid = this.currentlyDisplayed._id;
    this.fb.setValue ({
      blogcategory: this.draftblog.category
    });
    this.notUpdated = true;
    this.mediaPath = this.currentlyDisplayed.media;
    this.changeCategory('Add Edit Post');
  }

  firstBlogGroup() {
    this.displayedBlogsNDX = 0;
    this.prepareBlogDisplay();
  }
  previousBlogGroup() {
    this.displayedBlogsNDX = this.displayedBlogsNDX - 4;
    while ((this.displayedBlogsNDX) % 3 !== 0) {
      this.displayedBlogsNDX--;
    }
    this.prepareBlogDisplay();
  }
  nextBlogGroup() {
    this.prepareBlogDisplay();
  }
  lastBlogGroup() {
    if (this.xblogs.length % 3 === 0) {
      this.displayedBlogsNDX = this.xblogs.length - 3;
    } else {
      this.displayedBlogsNDX = this.xblogs.length - (this.xblogs.length % 3);
    }
    this.prepareBlogDisplay();
  }
  displayThisBlog(j) {
    this.currentlyDisplayed = this.displayedBlogs[j];
    this.currentlyDisplayedNDX = j;
    this.setHateLove();
    this._cid = '';
    this.komment = '';
    this.commentNotUpdated = true;
  }

  changeNotUpdated() {
    if (this.draftblog.title !== ''
      && this.draftblog.post !== ''
      && this.draftblog.media !== '') {
      this.notUpdated = false;
    }
  }
  setHateLove() {
    if (this.currentlyDisplayed.hearted.indexOf(this.realname) === -1) {
      this.iLove = false;
    } else {
      this.iLove = true;
    }
    if (this.currentlyDisplayed.hated.indexOf(this.realname) === -1) {
      this.iHate = false;
    } else {
      this.iHate = true;
    }
  }
  toggleLove() {
    if (this.iLove) {
      this.currentlyDisplayed.hearts--;
      this.currentlyDisplayed.hearted.splice(this.currentlyDisplayed.hearted.indexOf(this.realname), 1);
    } else {
      this.currentlyDisplayed.hearts++;
      this.currentlyDisplayed.hearted.push(this.realname);
      if (this.iHate) {
        this.currentlyDisplayed.hates--;
        this.currentlyDisplayed.hated.splice(this.currentlyDisplayed.hated.indexOf(this.realname), 1);
        this.iHate = !this.iHate;
      }
    }
    this.iLove = !this.iLove;
    this.updateToggleLoveHate();
  }
  toggleHate() {
    if (this.iHate) {
      this.currentlyDisplayed.hates--;
      this.currentlyDisplayed.hated.splice(this.currentlyDisplayed.hated.indexOf(this.realname), 1);
    } else {
      this.currentlyDisplayed.hates++;
      this.currentlyDisplayed.hated.push(this.realname);
      if (this.iLove) {
        this.currentlyDisplayed.hearts--;
        this.currentlyDisplayed.hearted.splice(this.currentlyDisplayed.hearted.indexOf(this.realname), 1);
        this.iLove = !this.iLove;
      }
    }
    this.iHate = !this.iHate;
    this.updateToggleLoveHate();
  }
  updateToggleLoveHate() {
    const blog = {
      hearts: this.currentlyDisplayed.hearts,
      hearted: this.currentlyDisplayed.hearted,
      hates: this.currentlyDisplayed.hates,
      hated: this.currentlyDisplayed.hated
    };
    this.blogService.updateBlog(this.currentlyDisplayed._id, blog).subscribe(
      data => {
        const ndx = this.blogs.findIndex((b) => {
          return b._id === this.currentlyDisplayed._id;
        });
        this.blogs[ndx] = data;
        this.xblogs = [];
        if (this.category === 'all') {
          this.xblogs = this.blogs;
        } else {
          this.xblogs = this.blogs.filter( (b) => {
            return b.category === this.category;
           });
        }
        this.displayedBlogs[this.currentlyDisplayedNDX].hearts = data.hearts;
        this.displayedBlogs[this.currentlyDisplayedNDX].hearted = data.hearted;
        this.displayedBlogs[this.currentlyDisplayedNDX].hates = data.hates;
        this.displayedBlogs[this.currentlyDisplayedNDX].hated = data.hated;
      });
  }
  addPostComment() {
    if (this._cid === '') {
      const remark = {
        username: this.username,
        name: this.realname,
        comment:  this.komment
      };
      this.blogService.addComment(this.currentlyDisplayed._id, remark)
      .subscribe(blog => {
        const ndx = this.blogs.findIndex((b) => {
          return b._id === this.currentlyDisplayed._id;
        });
        this.blogs[ndx] = blog;
        this.xblogs = [];
        if (this.category === 'all') {
          this.xblogs = this.blogs;
        } else {
          this.xblogs = this.blogs.filter( (b) => {
            return b.category === this.category;
           });
        }
        this.currentlyDisplayed.comments = blog.comments;
        this.displayedBlogs[this.currentlyDisplayedNDX].comments = blog.comments;
        console.log('during-add-comment ndx, blog, this.xblogs, this.blogs', ndx, blog, this.xblogs, this.blogs);
      },
        errormessage => {
          this.message = <any>errormessage;
          this.messageClass = 'alert alert-danger';
      });
    } else {
      const remark = {
        'comment':  this.komment
      };
      this.blogService.updateComment(this.currentlyDisplayed._id, this._cid, remark)
      .subscribe(blog => {
        const ndx = this.blogs.findIndex((b) => {
          return b._id === this.currentlyDisplayed._id;
        });
        this.blogs[ndx] = blog;
        this.xblogs = [];
        if (this.category === 'all') {
          this.xblogs = this.blogs;
        } else {
          this.xblogs = this.blogs.filter( (b) => {
            return b.category === this.category;
           });
        }
        this.currentlyDisplayed.comments = blog.comments;
        this.displayedBlogs[this.currentlyDisplayedNDX].comments = blog.comments;
        console.log('during-Update-comment ndx, blog, this.xblogs, this.blogs', ndx, blog, this.xblogs, this.blogs);
      },
        errormessage => {
          this.message = <any>errormessage;
          this.messageClass = 'alert alert-danger';
      });
    }
    this.commentNotUpdated = true;
    this.komment = '';
    this._cid = '';
  }
  cancelPostComment() {
    this._cid = '';
    this.komment = '';
    this.commentNotUpdated = true;
  }
  deleteComments(j) {
    this.blogService.deleteComment(this.currentlyDisplayed._id, this.currentlyDisplayed.comments[j]._id)
    .subscribe(blog => {
      const ndx = this.blogs.findIndex((b) => {
        return b._id === this.currentlyDisplayed._id;
      });
      this.blogs[ndx] = blog;
      this.xblogs = [];
      if (this.category === 'all') {
        this.xblogs = this.blogs;
      } else {
        this.xblogs = this.blogs.filter( (b) => {
          return b.category === this.category;
         });
      }
      this.currentlyDisplayed.comments = blog.comments;
      this.displayedBlogs[this.currentlyDisplayedNDX].comments = blog.comments;
    },
      errormessage => {
        this.message = <any>errormessage;
        this.messageClass = 'alert alert-danger';
    });
  }
  editComments(j) {
    this.komment = this.currentlyDisplayed.comments[j].comment;
    this._cid = this.currentlyDisplayed.comments[j]._id;
    console.log(j, this.currentlyDisplayed._id, this._cid);
    this.commentNotUpdated = true;
  }

}
