async function loadBlog() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    
   const response = await fetch("../json/blog.json");
    const blogs = await response.json();
    const blog = blogs.find(b => b.id == id);

    if (blog) {
      // Set heading, image, metadata
      document.querySelector(".li-blog-heading a").innerText = blog.title;
      document.querySelector(".li-blog-banner img").src = blog.image;
      document.querySelector(".author").innerHTML = `<i class="fa fa-user"></i> ${blog.author}`;
      document.querySelector(".post-time").innerHTML = `<i class="fa fa-calendar"></i> ${blog.date}`;

      // Load full HTML content from blog file
      const blogContent = await fetch(blog.file).then(res => res.text());
      document.querySelector(".blog-content-area").innerHTML = blogContent;

      // Tags
      let tagsHtml = blog.tags.map(tag => `<a href="#">${tag}</a>`).join(", ");
      document.querySelector(".li-tag-line").innerHTML = `<h4>tag:</h4>${tagsHtml}`;
    } else {
      document.querySelector(".li-blog-details").innerHTML = "<h3>Blog not found</h3>";
    }
  }

  loadBlog();