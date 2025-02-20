export interface message {
  name: string;
  title: string;
  body: string;
  type: 'personal' | 'work' | 'social' | 'private';
  time: string;
  marked: boolean;
  important: boolean;
};



export const messages: message[] = [
    {
    "name": "Laura Jones",
    "title": "Promotion Offer",
    "body": "Exciting news! We’re offering a limited-time promotion on our premium services. Upgrade now and enjoy exclusive benefits tailored just for you. Don’t miss out on this opportunity!",
    "type": "work",
    "time": "2025-01-01",
    "marked": true,
    "important": false
    },
    {
    "name": "John Smith",
    "title": "Project Update",
    "body": "The development team has made significant progress on the upcoming release. We’re on track to complete the next milestone by the end of this week. Stay tuned for further updates!",
    "type": "work",
    "time": "2025-01-02",
    "marked": false,
    "important": true
    },
    {
    "name": "Emma Brown",
    "title": "Event Invitation",
    "body": "Join us for our annual networking event this Friday! It’s a great opportunity to connect with industry professionals and explore new business opportunities.",
    "type": "personal",
    "time": "2025-01-03",
    "marked": true,
    "important": false
    },
    {
    "name": "David Wilson",
    "title": "Monthly Newsletter",
    "body": "Welcome to this month’s edition of our newsletter! Discover the latest trends and insights in the industry, along with special announcements from our team.",
    "type": "work",
    "time": "2025-01-04",
    "marked": false,
    "important": false
    },
    {
    "name": "Sophia Martinez",
    "title": "Weekend Getaway Plan",
    "body": "Hey! Let’s plan a weekend getaway. I found a great place with amazing views and activities. Let me know if you’re interested!",
    "type": "personal",
    "time": "2025-01-05",
    "marked": true,
    "important": true
    },
    {
    "name": "Michael Anderson",
    "title": "Important Client Meeting",
    "body": "Reminder: We have an important client meeting scheduled for Monday morning. Please be prepared with the necessary reports and presentations.",
    "type": "work",
    "time": "2025-01-06",
    "marked": true,
    "important": true
    },
    {
    "name": "Olivia Taylor",
    "title": "Product Launch Announcement",
    "body": "We’re excited to announce the launch of our latest product! Be the first to experience its incredible features and benefits.",
    "type": "work",
    "time": "2025-01-07",
    "marked": false,
    "important": true
    },
    {
    "name": "William Lee",
    "title": "Weekend Plans",
    "body": "Hey! Do you have any plans for the weekend? Let’s catch up over coffee and discuss some new ideas.",
    "type": "personal",
    "time": "2025-01-08",
    "marked": true,
    "important": false
    },
    {
    "name": "Emily Davis",
    "title": "Security Update",
    "body": "Please update your passwords and enable two-factor authentication for enhanced security. Let us know if you need any assistance.",
    "type": "work",
    "time": "2025-01-09",
    "marked": false,
    "important": true
    },
    {
    "name": "James Carter",
    "title": "Upcoming Conference",
    "body": "Join us at the upcoming tech conference next month. It’s an excellent opportunity to learn, network, and grow!",
    "type": "work",
    "time": "2025-01-10",
    "marked": false,
    "important": false
    },
  {
    name: 'Laura Jones',
    title: 'Promotion Offer',
    body: `Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quisquam exercitationem quas, quo laborum eaque minus porro ipsa, consectetur maiores quaerat sequi, modi sed nisi blanditiis officia similique soluta quasi.`,
    type: 'work',
    time: '2025-01-01',
    marked: true,
    important: false,
  },
  {
    name: 'Michael Brown',
    title: 'Meeting Reminder',
    body: `Accusamus iste dolorum fugiat maxime sapiente eos. Placeat quod itaque beatae.`,
    type: 'work',
    time: '2025-01-02',
    marked: false,
    important: true,
  },
  {
    name: 'Sophia Wilson',
    title: 'New Social Event',
    body: `Rerum cumque quia porro nobis quos. Expedita, similique facere inventore debitis.`,
    type: 'social',
    time: '2025-01-03',
    marked: true,
    important: true,
  },
  {
    name: 'James Davis',
    title: 'Weekend Plans',
    body: `Voluptatum magni eum libero officia iusto consectetur doloribus accusamus quisquam!`,
    type: 'personal',
    time: '2025-01-04',
    marked: false,
    important: false,
  },
  {
    name: 'Emma Taylor',
    title: 'Private Reminder',
    body: `Dolor nesciunt alias earum veniam mollitia quos culpa voluptatem officiis.`,
    type: 'private',
    time: '2025-01-05',
    marked: true,
    important: false,
  },
  {
    name: 'Noah Moore',
    title: 'Work Deadline',
    body: `Dicta debitis illo obcaecati nostrum nulla, voluptatibus eveniet vel numquam?`,
    type: 'work',
    time: '2025-01-06',
    marked: false,
    important: true,
  },
  {
    name: 'Ava Clark',
    title: 'Birthday Invitation',
    body: `Saepe nobis odit sit unde aliquid laborum suscipit numquam veniam.`,
    type: 'social',
    time: '2025-01-07',
    marked: false,
    important: false,
  },
  {
    name: 'Liam White',
    title: 'Work Follow-Up',
    body: `Eligendi reprehenderit corporis ad tempora, quo dolorum consequatur odio maiores.`,
    type: 'work',
    time: '2025-01-08',
    marked: true,
    important: true,
  },
  {
    name: 'Mia Walker',
    title: 'Family Update',
    body: `Omnis harum officia pariatur aliquid dolore. Quibusdam delectus esse ullam!`,
    type: 'personal',
    time: '2025-01-09',
    marked: false,
    important: false,
  },
  {
    name: 'William Hall',
    title: 'Private Alert',
    body: `Magni non eos alias neque error dolore perspiciatis. Saepe, ipsa?`,
    type: 'private',
    time: '2025-01-10',
    marked: true,
    important: false,
  },
  {
    name: 'Isabella Lewis',
    title: 'Social Gathering',
    body: `Reprehenderit provident fugit necessitatibus vero quas. Perferendis obcaecati rerum assumenda!`,
    type: 'social',
    time: '2025-01-11',
    marked: false,
    important: true,
  },
  {
    name: 'Elijah Young',
    title: 'Private Info',
    body: `Quidem eveniet nostrum quisquam. Nihil optio officiis blanditiis quae obcaecati.`,
    type: 'private',
    time: '2025-01-12',
    marked: true,
    important: false,
  },
  {
    name: 'Oliver Scott',
    title: 'Work Completion',
    body: `Earum consequatur voluptatibus maiores ipsum illum impedit perferendis commodi!`,
    type: 'work',
    time: '2025-01-13',
    marked: false,
    important: false,
  },
  {
    name: 'Amelia Green',
    title: 'Social Activity',
    body: `Autem eligendi nobis porro beatae laboriosam facere explicabo consectetur asperiores.`,
    type: 'social',
    time: '2025-01-14',
    marked: true,
    important: true,
  },
  {
    name: 'Benjamin Adams',
    title: 'Work Discussion',
    body: `Corrupti cupiditate dignissimos, optio labore iure explicabo. Voluptatibus deserunt esse!`,
    type: 'work',
    time: '2025-01-15',
    marked: false,
    important: false,
  },
  {
    name: 'Charlotte Baker',
    title: 'Private Note',
    body: `Inventore dolores cumque, explicabo deleniti excepturi labore commodi soluta!`,
    type: 'private',
    time: '2025-01-16',
    marked: true,
    important: false,
  },
  {
    name: 'Henry Turner',
    title: 'Work Task',
    body: `Distinctio deserunt sed dolore, facere architecto natus ullam necessitatibus laboriosam.`,
    type: 'work',
    time: '2025-01-17',
    marked: false,
    important: true,
  },
  {
    name: 'Evelyn Hill',
    title: 'Social Event Reminder',
    body: `Quas, facilis asperiores omnis totam veniam recusandae explicabo harum eos!`,
    type: 'social',
    time: '2025-01-18',
    marked: false,
    important: false,
  },
  {
    name: 'Alexander Phillips',
    title: 'Personal Notification',
    body: `Aut laudantium aliquid dolorum, expedita molestiae esse fuga porro reprehenderit!`,
    type: 'personal',
    time: '2025-01-19',
    marked: true,
    important: true,
  },
  {
    name: 'Harper Evans',
    title: 'Private Event',
    body: `Sapiente molestias perspiciatis vero, dolorum perferendis quam laborum maiores architecto?`,
    type: 'private',
    time: '2025-01-20',
    marked: false,
    important: false,
  },
  {
    name: 'Daniel Parker',
    title: 'Social Alert',
    body: `Error recusandae consequuntur unde maiores totam necessitatibus minima voluptatem facilis.`,
    type: 'social',
    time: '2025-01-21',
    marked: true,
    important: true,
  },
  {
    name: 'Grace Edwards',
    title: 'Private Info',
    body: `Dolorum sint asperiores doloremque iusto rem pariatur. Commodi, temporibus dicta?`,
    type: 'private',
    time: '2025-01-22',
    marked: false,
    important: true,
  },
  {
    name: 'Jackson Roberts',
    title: 'Work Update',
    body: `Molestias iure reprehenderit nemo nobis alias numquam. Laudantium accusamus natus!`,
    type: 'work',
    time: '2025-01-23',
    marked: true,
    important: false,
  },
  {
    name: 'Victoria Turner',
    title: 'Social Reminder',
    body: `Numquam at neque nobis, veniam accusantium reprehenderit. Doloribus, rerum ex?`,
    type: 'social',
    time: '2025-01-24',
    marked: false,
    important: true,
  },
  {
    name: 'Mason Harris',
    title: 'Work Follow-Up',
    body: `Itaque reprehenderit harum voluptates molestias ipsa. Ducimus voluptatum nobis labore?`,
    type: 'work',
    time: '2025-01-25',
    marked: true,
    important: false,
  },
  {
    name: 'Abigail Carter',
    title: 'Private Matter',
    body: `Aspernatur necessitatibus reiciendis dolor voluptates officiis natus nisi totam?`,
    type: 'private',
    time: '2025-01-26',
    marked: false,
    important: true,
  },
  {
    name: 'Sebastian Ramirez',
    title: 'Social Gathering Update',
    body: `Vel beatae sunt consectetur debitis. Harum, reprehenderit eaque repudiandae explicabo?`,
    type: 'social',
    time: '2025-01-27',
    marked: false,
    important: false,
  },
  {
    name: 'Luna Martin',
    title: 'Private Meeting',
    body: `Accusantium hic nostrum expedita odio quaerat perspiciatis amet modi maiores.`,
    type: 'private',
    time: '2025-01-28',
    marked: true,
    important: true,
  },
  {
    name: 'Lucas Nelson',
    title: 'Work Deadline Update',
    body: `Quidem assumenda sequi voluptas optio ullam, ratione alias dolore magnam.`,
    type: 'work',
    time: '2025-01-29',
    marked: false,
    important: false,
  },
  {
    name: 'Scarlett Clark',
    title: 'Social Celebration',
    body: `Totam inventore dignissimos doloribus architecto deserunt sit soluta ipsam distinctio.`,
    type: 'social',
    time: '2025-01-30',
    marked: true,
    important: true,
  },
];
export const trash : message[] = [
  {
    name: 'Henry Turner',
    title: 'Work Task',
    body: `Distinctio deserunt sed dolore, facere architecto natus ullam necessitatibus laboriosam.`,
    type: 'work',
    time: '2025-01-17',
    marked: false,
    important: true,
  },
  {
    name: 'Evelyn Hill',
    title: 'Social Event Reminder',
    body: `Quas, facilis asperiores omnis totam veniam recusandae explicabo harum eos!`,
    type: 'social',
    time: '2025-01-18',
    marked: false,
    important: false,
  },
  {
    name: 'Alexander Phillips',
    title: 'Personal Notification',
    body: `Aut laudantium aliquid dolorum, expedita molestiae esse fuga porro reprehenderit!`,
    type: 'personal',
    time: '2025-01-19',
    marked: true,
    important: true,
  },
  {
    name: 'Harper Evans',
    title: 'Private Event',
    body: `Sapiente molestias perspiciatis vero, dolorum perferendis quam laborum maiores architecto?`,
    type: 'private',
    time: '2025-01-20',
    marked: false,
    important: false,
  },
  {
    name: 'Daniel Parker',
    title: 'Social Alert',
    body: `Error recusandae consequuntur unde maiores totam necessitatibus minima voluptatem facilis.`,
    type: 'social',
    time: '2025-01-21',
    marked: true,
    important: true,
  },
  {
    name: 'Grace Edwards',
    title: 'Private Info',
    body: `Dolorum sint asperiores doloremque iusto rem pariatur. Commodi, temporibus dicta?`,
    type: 'private',
    time: '2025-01-22',
    marked: false,
    important: true,
  },
  {
    name: 'Jackson Roberts',
    title: 'Work Update',
    body: `Molestias iure reprehenderit nemo nobis alias numquam. Laudantium accusamus natus!`,
    type: 'work',
    time: '2025-01-23',
    marked: true,
    important: false,
  },
  {
    name: 'Victoria Turner',
    title: 'Social Reminder',
    body: `Numquam at neque nobis, veniam accusantium reprehenderit. Doloribus, rerum ex?`,
    type: 'social',
    time: '2025-01-24',
    marked: false,
    important: true,
  },
]

export const sentMessages : message[] = [
  {
    name: 'Harper Evans',
    title: 'Private Event',
    body: `Sapiente molestias perspiciatis vero, dolorum perferendis quam laborum maiores architecto?`,
    type: 'private',
    time: '2025-01-20',
    marked: false,
    important: false,
  },
  {
    name: 'Daniel Parker',
    title: 'Social Alert',
    body: `Error recusandae consequuntur unde maiores totam necessitatibus minima voluptatem facilis.`,
    type: 'social',
    time: '2025-01-21',
    marked: true,
    important: true,
  },
  {
    name: 'Grace Edwards',
    title: 'Private Info',
    body: `Dolorum sint asperiores doloremque iusto rem pariatur. Commodi, temporibus dicta?`,
    type: 'private',
    time: '2025-01-22',
    marked: false,
    important: true,
  },
  {
    name: 'Jackson Roberts',
    title: 'Work Update',
    body: `Molestias iure reprehenderit nemo nobis alias numquam. Laudantium accusamus natus!`,
    type: 'work',
    time: '2025-01-23',
    marked: true,
    important: false,
  },
  {
    name: 'Victoria Turner',
    title: 'Social Reminder',
    body: `Numquam at neque nobis, veniam accusantium reprehenderit. Doloribus, rerum ex?`,
    type: 'social',
    time: '2025-01-24',
    marked: false,
    important: true,
  },
];
export const spam : message[] = [
  {
    name: 'Abigail Carter',
    title: 'Private Matter',
    body: `Aspernatur necessitatibus reiciendis dolor voluptates officiis natus nisi totam?`,
    type: 'private',
    time: '2025-01-26',
    marked: false,
    important: true,
  },
  {
    name: 'Sebastian Ramirez',
    title: 'Social Gathering Update',
    body: `Vel beatae sunt consectetur debitis. Harum, reprehenderit eaque repudiandae explicabo?`,
    type: 'social',
    time: '2025-01-27',
    marked: false,
    important: false,
  },
  {
    name: 'Luna Martin',
    title: 'Private Meeting',
    body: `Accusantium hic nostrum expedita odio quaerat perspiciatis amet modi maiores.`,
    type: 'private',
    time: '2025-01-28',
    marked: true,
    important: true,
  },
  {
    name: 'Lucas Nelson',
    title: 'Work Deadline Update',
    body: `Quidem assumenda sequi voluptas optio ullam, ratione alias dolore magnam.`,
    type: 'work',
    time: '2025-01-29',
    marked: false,
    important: false,
  },
  {
    name: 'Scarlett Clark',
    title: 'Social Celebration',
    body: `Totam inventore dignissimos doloribus architecto deserunt sit soluta ipsam distinctio.`,
    type: 'social',
    time: '2025-01-30',
    marked: true,
    important: true,
  },
];


export const drafts: message[] = [
  {
    name: 'Henry Turner',
    title: 'Work Task',
    body: `Distinctio deserunt sed dolore, facere architecto natus ullam necessitatibus laboriosam.`,
    type: 'work',
    time: '2025-01-17',
    marked: false,
    important: true,
  },
  {
    name: 'Evelyn Hill',
    title: 'Social Event Reminder',
    body: `Quas, facilis asperiores omnis totam veniam recusandae explicabo harum eos!`,
    type: 'social',
    time: '2025-01-18',
    marked: false,
    important: false,
  },
  {
    name: 'Alexander Phillips',
    title: 'Personal Notification',
    body: `Aut laudantium aliquid dolorum, expedita molestiae esse fuga porro reprehenderit!`,
    type: 'personal',
    time: '2025-01-19',
    marked: true,
    important: true,
  },
  {
    name: 'Harper Evans',
    title: 'Private Event',
    body: `Sapiente molestias perspiciatis vero, dolorum perferendis quam laborum maiores architecto?`,
    type: 'private',
    time: '2025-01-20',
    marked: false,
    important: false,
  },
]

