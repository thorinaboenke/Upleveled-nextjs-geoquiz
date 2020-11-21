import React, { useState, useRef, useEffect, useCallback } from 'react';
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
    margin-top: 80px;
    padding-bottom: 1em;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .placeholder {
    height: 200px;
    width: 200px;
    background-color: lightgray;
    margin-bottom: 2em;
    margin-top: 2em;
  }
  /* canvas {
    border-radius: 50%;
  } */
  /* .preview {
    height: 100px;
    margin: 1em;
  } */
  .previewPlaceholder {
    border-radius: 50%;
    height: 100px;
    width: 100px;
    background-color: lightgray;
    margin: 1em;
  }
  .preview {
     {
      border-radius: 50%;
      height: 100px;
      width: 100px;

      margin: 1em;
    }
  }

  button {
    cursor: pointer;
    min-width: 200px;
    font-family: monospace;
    font-size: 16px;
    border-radius: 20px;
    text-align: center;
    padding: 0.5em;
    color: white;
    background-color: ${colors.primary};
    border: 3px solid ${colors.primary};
    margin: 1em;
  }
  button:hover {
    background-color: ${colors.primaryLight};
    border: 3px solid ${colors.primaryLight};
  }
  button:disabled {
    background-color: white;
    border: 3px solid ${colors.primaryLight};
    color: ${colors.primaryLight};
    opacity: 0.5;
  }
`;

const pixelRatio = 1;

// We resize the canvas down when saving on retina devices otherwise the image
// will be double or triple the preview size.
function getResizedCanvas(canvas, newWidth, newHeight) {
  const tmpCanvas = document.createElement('canvas');
  tmpCanvas.width = newWidth;
  tmpCanvas.height = newHeight;

  const ctx = tmpCanvas.getContext('2d');
  ctx.drawImage(
    canvas,
    0,
    0,
    canvas.width,
    canvas.height,
    0,
    0,
    newWidth,
    newHeight,
  );

  return tmpCanvas;
}

function Profile(props) {
  const { user, loggedIn, token } = props;
  const router = useRouter();
  const url = 'https://api.cloudinary.com/v1_1/snapdragon/image/upload';
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(props.user.avatarUrl);
  const [upImg, setUpImg] = useState();
  const imgRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 / 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fileUploadHandler2 = async (canvas) => {
    var dataURL = canvas.toDataURL();

    postPicture(dataURL, user.userId, token);

    async function postPicture(data2, userId, token2) {
      const response = await fetch('/api/avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: data2,
          userId: userId,
          token: token2,
        }),
      });

      const { success, newUrl } = await response.json();
      if (success) {
        setMessage('Profile Picture updated');
        setImageUrl(newUrl);
      } else {
        setErrorMessage('Profile Picture could not be updated');
      }
    }
  };

  const fileUploadHandler = async (canvas) => {
    canvas.toBlob((blob) => {
      const data = new FormData();
      data.append('file', blob);
      data.append('upload_preset', 'geoquiz');

      async function postPicture(dest, picture) {
        const res = await fetch(dest, {
          method: 'POST',
          body: picture,
        });
        const cloudinaryResponse = await res.json();
        setImageUrl(cloudinaryResponse.secure_url);

        if (cloudinaryResponse.secure_url) {
          const response = await fetch('/api/profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.userId,
              avatarUrl: cloudinaryResponse.secure_url,
              token: token,
            }),
          });
          const { success } = await response.json();
          if (success) {
            setMessage('Profile Picture updated');
            user.avatarUrl = cloudinaryResponse.secure_url;
          } else {
            setErrorMessage('Profile Picture could not be updated');
          }
        }
      }
      postPicture(url, data);
    });
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image1 = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop1 = completedCrop;

    const scaleX = image1.naturalWidth / image1.width;
    const scaleY = image1.naturalHeight / image1.height;
    const ctx = canvas.getContext('2d');

    canvas.width = crop1.width * pixelRatio;
    canvas.height = crop1.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image1,
      crop1.x * scaleX,
      crop1.y * scaleY,
      crop1.width * scaleX,
      crop1.height * scaleY,
      0,
      0,
      crop1.width,
      crop1.height,
    );
  }, [completedCrop]);

  return (
    <Layout loggedIn={loggedIn} user={user} avatar={imageUrl}>
      <Head>
        <title>GeoQuiz - Profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={profileStyles}>
        <div className="outer-wrapper">
          <h2>You are logged in as: {user.username}</h2>
          <img
            className="preview"
            src={
              props.user.avatarUrl
                ? user?.avatarUrl
                : 'https://avatars.dicebear.com/api/gridy/:' +
                  user?.username +
                  '.svg'
            }
            alt="avatar"
          />
          <h2>Upload profile image</h2>

          <div>
            <input type="file" accept="image/*" onChange={onSelectFile} />
          </div>
          {upImg ? (
            <ReactCrop
              src={upImg}
              onImageLoaded={onLoad}
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              circularCrop={true}
            />
          ) : (
            <div className="placeholder"></div>
          )}
          <div>Preview</div>
          <div>
            {upImg ? (
              <canvas
                className="preview"
                ref={previewCanvasRef}
                style={{
                  width: Math.round(completedCrop?.width ?? 0),
                  height: Math.round(completedCrop?.height ?? 0),
                }}
              />
            ) : (
              <div className="previewPlaceholder"></div>
            )}
          </div>

          <button
            type="button"
            disabled={!completedCrop?.width || !completedCrop?.height}
            onClick={() => fileUploadHandler2(previewCanvasRef.current)}
          >
            Save image
          </button>
          {errorMessage && <div>{errorMessage}</div>}
          {message && <div>{message}</div>}
          <button
            onClick={async (e) => {
              if (
                window.confirm('Are you sure you want to delete your account?')
              ) {
                const response = await fetch('/api/signup', {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    username: user.username,
                    token: token,
                  }),
                });
                const { success } = await response.json();
                if (success) router.push('/deleted');
              }
            }}
          >
            Delete my account
          </button>
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
        token: token,
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
