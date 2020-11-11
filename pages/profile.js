import React, { useState } from 'react';
import cookies from 'next-cookies';
import nextCookies from 'next-cookies';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { isSessionTokenValid } from '../util/auth';
import {
  getUserBySessionToken,
  getScoresBySessionToken,
} from '../util/database';
import { css } from '@emotion/core';
import { colors } from '../assets/colors';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const profileStyles = css`
  .outer-wrapper {
    max-width: 900px;
    min-height: 80vh;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 1em;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  img {
    object-fit: cover;
    height: 200px;
    width: 200px;
    border-radius: 50%;
  }
`;

function Image(props) {
  return <img src={props.url} alt={props.alt} />;
}

function Profile(props) {
  const { user, loggedIn } = props;
  const router = useRouter();
  const baseUrl = 'https://api.cloudinary.com/v1_1/snapdragon';
  const url = 'https://api.cloudinary.com/v1_1/snapdragon/image/upload';
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const fileSelectedHandler = (e) => {
    setImage(e.target.files[0]);
  };
  const fileUploadHandler = async () => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'geoquiz');
    setLoading(true);
    const res = await fetch(url, {
      method: 'POST',
      body: data,
    });
    const file = await res.json();
    setImageUrl(file.secure_url);
    setLoading(false);
    // if response comes back insert url into user table in database
    if (imageUrl) {
      console.log('trying to update url');
      console.log('imageurl', imageUrl);
      console.log('file', file.secure_url);
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.userId,
          avatarUrl: file.secure_url,
        }),
      });
      const { success } = await response.json();
    }
  };

  return (
    <Layout loggedIn={loggedIn}>
      <Head>
        <title>GeoQuiz - Profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={profileStyles}>
        <div className="outer-wrapper">
          <div>{user.username}</div>
          <div>Upload profile image</div>
          <input
            className="file-upload"
            name="file"
            type="file"
            placeholder="Upload an image"
            onChange={(e) => fileSelectedHandler(e)}
          />
          <button onClick={() => fileUploadHandler()} disabled={!image}>
            Upload
          </button>
          {user.avatarUrl || imageUrl ? (
            <Image url={imageUrl || user.avatarUrl} alt={'profile'} />
          ) : (
            <img
              src={
                'https://avatars.dicebear.com/api/gridy/:' +
                user.username +
                '.svg'
              }
              alt="placeholder avatar"
            />
          )}
          <button
            onClick={async (e) => {
              const response = await fetch('/api/signup', {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: user.username }),
              });
              const { success } = await response.json();
              if (success) router.push('/deleted');
            }}
          >
            Delete my account
          </button>
          <div>
            <input type="file" accept="image/*" onChange={onSelectFile} />
            <ReactCrop
              src={upImg}
              onImageLoad={onLoad}
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompleteCrop}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;

export async function getServerSideProps(context) {
  const { session: token } = nextCookies(context);

  if (await isSessionTokenValid(token)) {
    const user = await getUserBySessionToken(token);
    const scores = await getScoresBySessionToken(token);
    console.log(user);
    return {
      props: {
        scores: scores,
        user: user,
        loggedIn: true,
      },
    };
  }
  return {
    redirect: {
      destination: '/login?returnTo=/profile',
      permanent: false,
    },
  };
}
