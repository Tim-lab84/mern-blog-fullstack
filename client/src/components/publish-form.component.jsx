import { Toaster, toast } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { useContext, useEffect } from "react";
import { EditorContext } from "../pages/editor.pages";
import Tag from "../components/tags.component";
import axios from "axios";
import { userContext } from "../App";
import { useNavigate } from "react-router-dom";

const PublishForm = () => {
  let characterLimit = 200;
  let tagLimit = 10;
  let {
    blog,
    blog: { banner, title, tags, des },
    setEditorState,
    setBlog,
  } = useContext(EditorContext);
  const handleCloseEvent = () => {
    setEditorState("editor");
  };

  let {
    userAuth: { access_token },
  } = useContext(userContext);

  let navigate = useNavigate();
  const handleBlogTitleChange = (e) => {
    let input = e.target;

    setBlog({ ...blog, title: input.value });
  };

  const handleBlogDescriptionChange = (e) => {
    let input = e.target;
    setBlog({ ...blog, des: input.value });
  };
  const handleTitleKeyDown = (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();
      let tag = e.target.value;

      if (tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
          setBlog({ ...blog, tags: [...tags, tag] });
        } else {
          toast.error(`You have reachted the maximum of ${tagLimit} tags`);
        }
      }
      e.target.value = "";
    }
  };

  useEffect(() => {
    if (tags.length >= tagLimit) {
      toast.error(`You have reached the maximum of ${tagLimit} tags`);
    }
  }, [tags.length]);

  const publishBlog = (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }

    // Check for missing values
    if (!title.length) {
      return toast.error("Please provide a blog title before publishing");
    }
    if (!des.length || des.length > 200) {
      return toast.error(
        `Please provide a description within ${characterLimit} characters before publishing`
      );
    }
    if (!tags.length) {
      return toast.error(
        "Please provide a tag before publishing to help us rank your blog"
      );
    }

    // Show loading toast
    let loadingToast = toast.loading("Publishing...");

    // Disable button to prevent double clicking
    e.target.classList.add("disable");

    // Define content (make sure this exists in your state)
    let blogObj = {
      title,
      banner,
      des,
      content: blog.content, // Ensure that content exists
      tags,
      draft: false,
    };

    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogObj, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => {
        e.target.classList.remove("disable"); // Enable button
        toast.dismiss(loadingToast);
        toast.success("Published successfully 😀");

        setTimeout(() => {
          navigate("/"); // Redirect after publishing
        }, 1000);
      })
      .catch((error) => {
        e.target.classList.remove("disable"); // Enable button
        toast.dismiss(loadingToast);

        // Handle server-side or network error
        if (error.response) {
          return toast.error(error.response.data.error || "An error occurred");
        } else if (error.request) {
          // Network error or request failed
          return toast.error("Network error. Please try again later.");
        } else {
          // Other errors (unknown)
          return toast.error("An error occurred while publishing the blog.");
        }
      });
  };

  return (
    <AnimationWrapper>
      <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
        <Toaster />

        <button
          className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
          onClick={handleCloseEvent}
        >
          <i className="fi fi-br-cross"></i>
        </button>

        <div className="max-w-[550px] center">
          <p className="text-dark-grey mb-1">Preview</p>

          <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
            <img src={banner} />
          </div>
          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
            {title}
          </h1>
          <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
            {des}
          </p>
        </div>

        <div className="border-grey lg:border-1 lg:pl-8">
          <p className="text-dark-grey mb-2 mt-9">Blog title</p>
          <input
            type="text"
            placeholder="Blog title"
            defaultValue={title}
            className="input-box pl-4"
            onChange={handleBlogTitleChange}
          />
          <p className="text-dark-grey mb-2 mt-9">
            Short description about your blog
          </p>

          <textarea
            maxLength={characterLimit}
            defaultValue={des}
            className="h-40 resize-none leading-7 input-box pl-4"
            onChange={handleBlogDescriptionChange}
            onKeyDown={handleTitleKeyDown}
          ></textarea>
          <p className="mt-1 text-dark-grey text-sm text-right">
            {characterLimit - des.length} characters left
          </p>

          <p className="text-dark-grey mb-2 mt-9">
            Topics - (Helps searching and ranking your blogs){" "}
          </p>

          <div className="relative input-box pl-2 py-2 pb-4">
            <input
              type="text"
              placeholder="Topic"
              className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
              onKeyDown={handleKeyDown}
            />
            {tags.map((tag, i) => {
              return <Tag tag={tag} tagIndex={i} key={i} />;
            })}
          </div>
          <p className="mt-1 mb-4 text-dark-grey text-right">
            {tagLimit - tags.length} Tags left
          </p>

          <button className="btn-dark px-8" onClick={publishBlog}>
            Publish
          </button>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default PublishForm;
