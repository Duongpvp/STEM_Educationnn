// @ts-nocheck
import { Group, Modal } from "@mantine/core";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { getAllPost } from "api/ClassRequest";
import SideBarMotion from "components/SideBarMotion/SideBarMotion";
import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import ReactTextareaAutosize from "react-textarea-autosize";
import ClassHeader from "../ClassHeader/ClassHeader";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadPost from "components/UploadPost/UploadPost";
import "./ClassProfile.css";
import { ToastContainer } from "react-toastify";
import { deleteClassPost } from "actions/ClassAction";

const ClassProfile = () => {
  const { user } = useSelector((state) => state.AuthReducer.authData);
  const [fetchAgain, setFetchAgain] = useState(false);
  const dispatch = useDispatch();
  const params = useParams();
  const [posts, setPosts] = useState([]);
  const [opened, setOpened] = useState(false);
  const [desc, setDesc] = useState();
  const [title, setTitle] = useState();

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const { data } = await getAllPost(params.id);
        setPosts(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchExercise();
  }, [fetchAgain]);

  const handleOpen = () => {
    setOpened(true);
  };

  const handleChangeDesc = (e) => {
    setDesc(e.target.value);
  };

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleDeletePost = (postId) => {
    try {
      dispatch(deleteClassPost(user._id, postId,setFetchAgain, fetchAgain));
    } catch (error) {
      console.log(error);
    }
  };
  console.log(fetchAgain);

  return (
    <div className="sidebar-container">
      <SideBarMotion />
      <div className="sidebar-body">
        <ToastContainer />
        <ClassHeader />
        <div className="news">
          <img
            src="https://i.pinimg.com/originals/74/2d/6e/742d6ef765435708f9799c25eb7cbb36.jpg"
            alt="thumbnail"
          />
          <div className="glass-card-grid">
            {(user.isAdmin || user.isTeacher) && (
              <div className="create-post-modal">
                <Modal
                  opened={opened}
                  onClose={() => setOpened(false)}
                  title="Create new post"
                  centered
                  size="50%"
                >
                  <div className="class-modal-content">
                    <div className="input-box">
                      <ReactTextareaAutosize
                        minRows={1}
                        name="title"
                        required
                        onChange={handleChangeTitle}
                      />
                      <label>Title</label>
                    </div>
                    <div className="input-box">
                      <ReactTextareaAutosize
                        minRows={1}
                        name="message"
                        required
                        className="submission"
                        onChange={handleChangeDesc}
                      />
                      <label>Description</label>
                    </div>
                    <UploadPost
                      title={title}
                      desc={desc}
                      setFetchAgain={setFetchAgain}
                      fetchAgain={fetchAgain}
                      setOpened={setOpened}
                    />
                  </div>
                </Modal>

                <Group position="center">
                  <button className="btn-create" onClick={handleOpen}>
                    <AddCircleIcon /> CREATE POST
                  </button>
                </Group>
              </div>
            )}
            {posts.map((post) => (
              <div className="frame-card" key={post._id}>
                {user.isAdmin ||
                  (user.isTeacher && (
                    <DeleteIcon onClick={() => handleDeletePost(post._id)} />
                  ))}
                <Link to={`./exercise/${post._id}`}>
                  <article className="glass-card">
                    <div className="glass-card-title">{post.postTitle}</div>
                    <p>{post.desc}</p>
                  </article>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ClassProfile);
