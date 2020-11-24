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
  h2 {
    text-align: center;
  }
  .relative {
    position: relative;
  }

  .inputfile {
    width: 0.1px;
    height: 0.1px;
    opacity: 0.5;
    overflow: hidden;
    position: relative;
    z-index: -1;
  }
  .inputfile + label {
    cursor: pointer;
    min-width: 250px;
    text-align: center;
    margin: 1em;
    font-size: 1em;
    font-weight: 700;
    padding: 1em;
    color: white;
    background-color: black;
    display: inline-block;
  }

  .inputfile:focus + label,
  .inputfile + label:hover {
    background-color: ${colors.primaryLight};
  }

  .inputfile:focus + label {
    outline: 1px dotted #000;
    outline: -webkit-focus-ring-color auto 5px;
  }
  .placeholder {
    height: 250px;
    width: 250px;
    background-color: lightgray;
    margin-bottom: 2em;
    margin-top: 2em;
  }
  .prev-text{
    margin: 1em;
  }

  .preview {
    height: 100px;
    margin: 1em;
  }
  .previewPlaceholder {
    border-radius: 50%;
    height: 100px;
    width: 100px;
    background-color: lightgray;
    margin: 1em;
  }
  .preview, .loader-container {
    border-radius: 50%;
    height: 100px;
    width: 100px;

    margin: 1em;
  }

  button {
    cursor: pointer;
    min-width: 250px;
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

  .spacer{
    margin-top:auto;
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

.loader-container{
    display:flex;
    justify-content: center;
    align-items: center;
    border: 1px solid gray;
  }
.loader {
  padding:0;
  border: 0.2em solid rgba(0, 0, 0, 0.1);
  border-top: 0.2em solid ${colors.primaryLight};
  border-radius: 50%;
  width: 2em;
  height: 2em;
  animation: spin 0.8s linear infinite;
}
  @keyframes spin {
    0% {
    transform: rotate(0deg);
}
100% {
    transform: rotate(360deg);
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
  const [imageUrl, setImageUrl] = useState(props.user.avatarUrl);
  const [upImg, setUpImg] = useState(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 / 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploaderActive, setUploaderActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const imgRef = useRef(null);
  const router = useRouter();

  const fileUploadHandler = async (canvas) => {
    var dataURL = canvas.toDataURL();
    setIsLoading(true);
    postPicture(dataURL, user.userId, token);
    async function postPicture(data, userId, sessiontoken) {
      const response = await fetch('/api/avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: data,
          userId: userId,
          token: sessiontoken,
          username: user.username,
        }),
      });

      const { success, newUrl } = await response.json();
      if (success) {
        setMessage('Profile Picture updated');
        setImageUrl(newUrl);
        setUpImg(null);
        setIsLoading(false);
      } else {
        setErrorMessage('Profile Picture could not be updated');
        setIsLoading(false);
      }
    }
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileSelected(true);
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

  const Preview = (props) => {
    return (
      <img
        className="preview"
        src={
          props.imageUrl ? imageUrl : props.url ? props.url : props.fallbackUrl
        }
        alt="avatar"
      />
    );
  };
  return (
    <Layout loggedIn={loggedIn} user={user} avatar={imageUrl}>
      <Head>
        <title>GeoQuiz - Profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={profileStyles}>
        <div className="outer-wrapper">
          <h2>You are logged in as:</h2>
          <h2>{user.username}</h2>
          {isLoading ? (
            <div className="loader-container">
              <div className="loader" />{' '}
            </div>
          ) : (
            <Preview
              imageUrl={imageUrl}
              url={user.avatarUrl}
              fallbackUrl={
                'https://avatars.dicebear.com/api/gridy/:' +
                user?.username +
                '.svg'
              }
            />
          )}
          {errorMessage && <div>{errorMessage}</div>}
          {message && <div>{message}</div>}
          <div className="spacer" />

          {uploaderActive && (
            <>
              <div className="relative">
                <input
                  className="inputfile"
                  name="file"
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={onSelectFile}
                />
                <label htmlFor="file">Choose a file</label>
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
                <div className="placeholder" />
              )}
              <div className="prev-text">Preview</div>
              <div>
                {upImg ? (
                  <canvas
                    className="preview"
                    ref={previewCanvasRef}
                    // style={{
                    //   width: Math.round(completedCrop?.width ?? 0),
                    //   height: Math.round(completedCrop?.height ?? 0),
                    // }}
                  />
                ) : (
                  <div className="previewPlaceholder" />
                )}
              </div>

              <button
                type="button"
                id="save"
                disabled={
                  !completedCrop?.width ||
                  !completedCrop?.height ||
                  !fileSelected
                }
                onClick={() => {
                  fileUploadHandler(previewCanvasRef.current);
                  setUploaderActive(!uploaderActive);
                  setMessage('');
                  setFileSelected(false);
                }}
              >
                Save image
              </button>
            </>
          )}
          <button
            id="upload-modal"
            onClick={() => {
              setUploaderActive(!uploaderActive);
              setMessage('');
            }}
            disabled={isLoading}
          >
            {!uploaderActive ? 'Upload profile image' : 'Cancel Upload'}
          </button>
          <button
            id="delete-account"
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
