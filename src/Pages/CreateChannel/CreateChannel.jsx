import React, { useState } from 'react';
import api from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import "@fontsource/poppins/800.css";
import "./createChannel.css";

const CreateChannel = () => {
  const [form, setForm] = useState({
    channelName: '',
    description: '',
    channelBanner: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); // 🔥 prevents page reload

    if (!form.channelName || !form.description) {
      toast.error("Channel name & description required");
      return;
    }

    try {
      await api.post('/api/channels', form);
      localStorage.setItem("hasChannel", "true");
      toast.success("Channel created!");
      navigate(`/user/${localStorage.getItem("userId")}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating channel');
    }
  };

  return (
    <div className="createChannel">
      <div className="createChannel_card">

        <div className="createChannel_title">
          Create Your Channel
        </div>

        {/* 🔥 REAL FORM */}
        <form className="createChannel_form" onSubmit={handleSubmit}>
          <div className="createChannelCredentials">
            <input
              name="channelName"
              placeholder="Channel Name"
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
            />

            <input
              name="channelBanner"
              placeholder="Banner URL (optional)"
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="createChannel-btn">
            Create Channel
          </button>
        </form>

      </div>
    </div>
  );
};

export default CreateChannel;
