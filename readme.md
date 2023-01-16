# &#x1F4CC; Coldcut Website Code - README

Welcome to ColdCut's upcoming E-Commerce website. We intend to sell shirts and other merchandise here, utilizing Stripe to handle payments securely. This is also my portfolio's centerpiece. Albeit unfinished, this is a complex and multi-month Full-Stack Web Development project that I take great pride in working on!

```mermaid
flowchart TD
    A[Django] -- API --> B[React];
    B -- CSS/HTML -->C[Website];
```

# &#x1F4C8; What's happening with this project?

Check out my project page at [Coldcut Github Project Planner](https://github.com/users/CoreyWarren/projects/5) for all my todo-lists and closed (completed) issues.

<br>



# &#x1F4F1; UI Preview

As of this update, what works so far:

- User Login
- User Registration
- Store Layout
- Dashboard Layout

![](readme_img/preview.gif)

To be improved:

- Cart Page
- Cart Notifications
- Login/Registration Input Fields and Buttons 

To be added:

- Reset Password
- Email System


# &#x1F4D9; What technologies are used here?

- Django (Back-end Web Development, API, REST)
- React (Front-End Web Development, Fetching)
- Github (Project Management and Organization)
- Redux (Store/State Management and Organization)
- Express (Router: Cookies and Async Requests)
- Python (Django)
- JavaScript (React)
- VSCode (Coding Environment)
- CSS (Web Styling Language)
- HTML (Web Markup Language)
- DigitalOcean (Web Hosting)
- Google Domains (Domain Name)

<br>

# &#x1F4AC; Progress Journal

> 09/19/2022:

> I feel like I'm roughly 50% done with what I wanted to achieve with this basic e-commerce website. User authentication was the hardest part of this, I feel, and as far as I know, setting up web applications (such as this project) is relatively simple with DigitalOcean and their Ubuntu servers/droplets. My main focus after finishing authentication and user recognition will be to start finding ways to SHOW you guys (or even just myself) the full order history of the website so we will be able to ship these shirts with minimal hassle. 

<br>

> 09/26/2022:

> APIs are fun and interesting. I really can't wait to get out of this backend jungle and start working more on the UI so that Cold Cut can really see what I've been working on. What I do have future concerns of are API backend security measures, and launching specifically the React frontend for the server during production. I'm not sure how nginx handles all of that stuff. Another concern is the cost-effectiveness of using a DigitalOcean server for a website that may be accessed by possibly hundreds of users in a day. How badly will this affect server costs? Will I need to take a larger cut of profits in order to pay to run the server? To be determined.

<br>

> 11/11/2022:

> I have learned a lot. This was supposed to be a 2-month project. Now it's looking like an 8 month project. Todo: implement the store.

<br>

> 01/07/2023:

> Store implemented on Frontend. That means you can see it. What you can't do yet: Interact with the store, add things to cart, or reset your password. But you can login, log out, register, and browse the store. So basically it would function as a fun little toy shop. But it's not useful yet for e-commerce. Let's keep pushing.

<br>

> 01/14/2023:

> Just reviewed how backend works. Worked on serializers a bit, worked on views, and added a new API for looking at product sizes. Nice! Backend is fresh in my mind again. Working between frontend and backend should be much easier from here on out. My todo list is in the projects tab of this repository, but here's a quick review on what's left:
> - Add to Cart functionality
> - Product Size/Color custom ordering
> - Integrate with Stripe
> - Secure API endpoints against attacks
> - Deploy Django and React together to serve as a single website - ColdCMerch.com!

<br>

# &#x1F528; Maintenance Notes

> To be added after Deployment...

# &#x1F5C1; Folder Structure

> To be added after Deployment...
