const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const slugify = require('../helpers/slugfield');
const Blog = require('../models/Blog');
const User = require('../models/User');
const Role = require('../models/Role');

async function initializeDatabase() {
    try {
        // Veritabanına bağlanma
        // mongoose.connect('mongodb://localhost:27017/Blog', { useNewUrlParser: true, useUnifiedTopology: true })
        console.log('Veritabanına başarıyla bağlanıldı.');

        await Blog.deleteMany({});
        await User.deleteMany({});
        await Role.deleteMany({});
        console.log("Clear database")

        // Her model için bir örnek oluşturacak fonksiyon
        async function createOneInstance(model, data) {
            try {
                await model.create(data);
                console.log(`Yeni bir ${model.modelName} örneği oluşturuldu.`);
            } catch (error) {
                console.error(`Hata: ${error.message}`);
            }
        }

        // Rollerin oluşturulması
        await createOneInstance(Role, { name: 'Admin' });
        await createOneInstance(Role, { name: 'Author' });
        await createOneInstance(Role, { name: 'User' });

        // Rollerin alınması
        const adminRole = await Role.findOne({ name: 'Admin' });
        const authorRole = await Role.findOne({ name: 'Author' });
        const userRole = await Role.findOne({ name: 'User' });

        // Admin kullanıcısının oluşturulması
        const passwordRoot = await bcrypt.hash('root', 10);
        await createOneInstance(User, {
            name: 'Emily Smith',
            email: 'emilysmith@mail.com',
            password: passwordRoot,
            slug: slugify('Emily Smith'),
            photo: 'emily.jpg',
            about: 'Emily Smith is a dedicated software engineer with a passion for turning innovative ideas into reality through code. From a young age, Emily was fascinated by the endless possibilities of technology, spending countless hours tinkering with computers and teaching herself how to code. With a strong foundation in computer science, Emily embarked on her journey as a software engineer, eager to make her mark in the ever-evolving world of technology. Armed with determination and a thirst for knowledge, she quickly established herself as a proficient developer, adept at navigating complex systems and solving intricate problems with elegant solutions.',
            role: adminRole._id
        });

        // Yazar kullanıcısının oluşturulması
        await createOneInstance(User, {
            name: 'William Thompson',
            email: 'williamthompson@mail.com',
            password: passwordRoot,
            slug: slugify('Author'),
            photo: 'william.jpg',
            about: 'William Thompson is a seasoned individual with a wealth of experience and a lifetime of stories to share. Born in a small town in the heart of the countryside, William journey has taken him through the twists and turns of life, shaping him into the remarkable individual he is today. Throughout his long and illustrious career, William has worn many hats, from a pioneering engineer to a visionary entrepreneur. He began his professional journey at a time when technology was in its infancy, witnessing firsthand the evolution of modern civilization and the transformative power of innovation.',
            role: authorRole._id
        });
        // User kullanıcısının oluşturlması
        await createOneInstance(User, {
            name: 'Eleanor Harris',
            email: 'elenaorharris@mail.com',
            password: passwordRoot,
            slug: slugify('Eleanor Harris'),
            photo: 'elenaor.jpeg',
            about: 'Eleanor Harris is a remarkable individual whose life story is a testament to resilience and strength. Born in a small town, Eleanor has faced numerous challenges throughout her life, but she has always emerged stronger and more determined than ever. Despite the hardships she has endured, Eleanors spirit remains unbroken, and her optimism is contagious. She has dedicated her life to helping others, volunteering at local charities and lending a helping hand to those in need.',
            role: userRole._id
        });

        // Blog gönderilerinin oluşturulması
        const authorUser = await User.findOne({ name: 'William Thompson' });
        await createOneInstance(Blog, {
            title: 'Modern Web Development with Node.js',
            subtitle: "Node.js revolutionizes web development with its speed and flexibility. Explore its robust toolset and pivotal role in modern applications. Learn to architect resilient backends and understand its widespread adoption.",
            description: "Modern web development with Node.js combines the power of JavaScript with a scalable, event-driven architecture, revolutionizing how web applications are built. Leveraging Node.js, developers can create fast, real-time applications that handle concurrent requests efficiently. With its extensive ecosystem of libraries and frameworks, Node.js enables the development of both server-side and client-side components, facilitating a seamless full-stack development experience. From building APIs to handling data-intensive operations, Node.js empowers developers to craft high-performance, scalable web applications that meet the demands of today's dynamic digital landscape.",
            photo: 'nodejs.png',
            slug: slugify('Modern Web Development with Node.js'),
            author: authorUser._id
        });
        await createOneInstance(Blog, {
            title: 'Asynchronous Programming in Node.js',
            subtitle: 'Asynchronous programming in Node.js, leveraging callbacks, promises, and async/await, enables seamless management of non-blocking operations. This fosters scalable, high-performance applications, ensuring responsiveness in modern web development.',
            description: 'Asynchronous programming in Node.js lies at the heart of its efficiency and scalability. Unlike synchronous programming, where each task blocks the execution until completion, asynchronous programming allows multiple operations to occur simultaneously without waiting for each other to finish. This non-blocking nature is crucial for handling I/O-bound tasks, such as reading from files or making network requests, where waiting for a response would lead to wasted time and resources. Node.js achieves asynchronicity through event-driven architecture and features like callbacks, promises, and async/await. Callbacks are the traditional way of handling asynchronous operations, where a function is passed as an argument to another function to be executed once the operation is completed. Promises provide a cleaner and more readable alternative to callbacks, allowing for better error handling and chaining of multiple asynchronous operations. Async/await, introduced in ES2017, further simplifies asynchronous code by allowing developers to write asynchronous code in a synchronous-looking style. This makes asynchronous programming in Node.js more intuitive and easier to reason about, especially for developers coming from synchronous programming backgrounds. In essence, mastering asynchronous programming in Node.js is essential for building scalable, high-performance applications that can handle concurrent tasks efficiently, providing users with a seamless and responsive experience.',
            photo: 'nodejs2.png',
            slug: slugify('Asynchronous Programming in Node.js'),
            author: authorUser._id
        });
        await createOneInstance(Blog, {
            title: 'Database Essentials',
            subtitle: "Databases are essential in modern software dev, facilitating data storage, access, and management. They're categorized as relational (SQL) or document-based (NoSQL), each with unique benefits. Mastery of database tech is crucial for devs to optimize app performance and scalability.",
            description: 'Databases serve as the cornerstone of modern software architecture, providing essential functionality for storing, managing, and retrieving data. They are indispensable components of virtually all software systems, ranging from small-scale applications to large enterprise solutions. In the realm of databases, there are various types and models, each tailored to different use cases and requirements. Relational databases, such as MySQL, PostgreSQL, and Oracle, organize data into structured tables with predefined schemas, enabling powerful querying capabilities through SQL (Structured Query Language). On the other hand, NoSQL databases, like MongoDB, Couchbase, and Cassandra, offer flexibility by accommodating unstructured or semi-structured data and supporting horizontal scalability. Effective database design and management are crucial for ensuring the performance, reliability, and security of applications. Proper indexing, normalization, and denormalization strategies can optimize query performance and reduce data redundancy. Additionally, implementing robust backup and recovery mechanisms is essential for safeguarding data integrity and availability. As applications grow in complexity and scale, the choice of database technology becomes increasingly critical. Factors such as data volume, access patterns, and transaction requirements influence the selection of the most suitable database solution. Moreover, the advent of cloud-native databases and serverless computing has further diversified the landscape, offering new opportunities for scalability and cost efficiency. In summary, databases play a pivotal role in modern software development, empowering developers to build robust, scalable, and efficient applications. Understanding the principles of database design, management, and optimization is essential for delivering high-quality software solutions that meet the evolving needs of businesses and users alike.',
            photo: 'databases.png',
            slug: slugify('Database Essentials'),
            author: authorUser._id
        });
        await createOneInstance(Blog, {
            title: "Vue.js Overview",
            subtitle: 'Vue.js is a popular JavaScript framework for modern web development. It enables building web applications with its user-friendly and flexible structure. Known for its lightweight and modular component-based approach, Vue.js is preferred by developers. It easily integrates with other JavaScript libraries and boasts a wide user base.',
            description: "Vue.js is a JavaScript framework that has gained popularity in modern web development. It provides developers with an easy-to-use and flexible structure, making it a powerful tool for building web applications. One of Vue.js' notable features is its lightweight nature and ease of learning, making it preferred by both beginners and experienced developers. Vue.js is designed to meet many modern web development needs. Single-page applications (SPAs), e-commerce sites, admin panels, and more can be built using Vue.js. Its component-based structure allows you to modularize your application into manageable pieces, facilitating easier maintenance. Furthermore, Vue.js can easily integrate with other commonly used JavaScript libraries and tools. For example, you can add routing to your application with Vue Router, implement centralized state management with Vuex, and quickly scaffold a starter project with Vue CLI. In conclusion, Vue.js has become a significant player in the web development world and is increasingly favored by developers. With its simplicity, flexibility, and developer-friendly structure, Vue.js has become a powerful choice for building web applications.",
            photo: "vuejs.jfif",
            slug: slugify('Vue.js Overview'),
            author: authorUser._id
        });

        // Veritabanı bağlantısını kapatma
        await mongoose.connection.close();
        console.log('Veritabanı bağlantısı başarıyla kapatıldı.');
    } catch (error) {
        console.error('Veritabanı işlemlerinde bir hata oluştu:', error);
    }
}

module.exports = initializeDatabase