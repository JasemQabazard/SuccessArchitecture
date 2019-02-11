export class Blog {
   _id?: string;
   username: string;
   media: string;    // embeded video or image stored on google S3 Cloud
   category: string;
   hearts?: number;
   hearted?: [string];
   hates?: number;
   hated?: [string];
   title: string;
   post: string;
   comments?: [{
      _id: string,
      username: string,
      name: string,
      comment: string,
      hearts: number,
      hearted: [string],
      hates: number,
      hated: [string],
      createdAt: string,
      updatedAt: string
   }];
   createdAt?: string;
   updatedAt?: string;
}

export class Comment {
   _id: string;
   username: string;
   name: string;
   comment: string;
   hearts: number;
   hearted: [string];
   hates: number;
   hated: [string];
}

export class BlogCategory {
  blogcategoryname: string;
}

export class DraftBlog {
  _id?: string;
  username: string;
  media: string;
  category: string;
  title: string;
  post: string;
}

export const awsMediaPath = 'https://s3-ap-southeast-1.amazonaws.com/successarchitecture/';
