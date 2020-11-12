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
    padding-bottom: 1em;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  img {
    height: 200px;
  }
  canvas {
    border-radius: 50%;
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

function generateDownload(previewCanvas, crop) {
  if (!crop || !previewCanvas) {
    return;
  }

  const canvas = getResizedCanvas(previewCanvas, crop.width, crop.height);

  canvas.toBlob(
    (blob) => {
      const previewUrl = window.URL.createObjectURL(blob);

      const anchor = document.createElement('a');
      anchor.download = 'cropPreview.png';
      anchor.href = URL.createObjectURL(blob);
      anchor.click();

      window.URL.revokeObjectURL(previewUrl);
    },
    'image/png',
    1,
  );
}

function Profile(props) {
  const { user, loggedIn, token } = props;
  const router = useRouter();
  const baseUrl = 'https://api.cloudinary.com/v1_1/snapdragon';
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

  const fileUploadHandler = async (canvas) => {
    canvas.toBlob((blob) => {
      const data = new FormData();
      data.append('file', blob);
      data.append('upload_preset', 'geoquiz');

      async function postPicture(dest, payload) {
        const res = await fetch(dest, {
          method: 'POST',
          body: payload,
        });
        const cloudinaryResponse = await res.json();
        setImageUrl(cloudinaryResponse.secure_url);

        if (cloudinaryResponse.secure_url) {
          console.log('updating avatar url');
          console.log('imageurl', imageUrl);
          console.log('file', cloudinaryResponse.secure_url);
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
    <Layout loggedIn={loggedIn}>
      <Head>
        <title>GeoQuiz - Profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={profileStyles}>
        <div className="outer-wrapper">
          <div>{user.username}</div>
          <div>Upload profile image</div>
          <div>
            <input type="file" accept="image/*" onChange={onSelectFile} />
          </div>
          <ReactCrop
            src={upImg}
            onImageLoaded={onLoad}
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
          />
          <div>Preview</div>
          <div>
            <canvas
              ref={previewCanvasRef}
              // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
              style={{
                width: Math.round(completedCrop?.width ?? 0),
                height: Math.round(completedCrop?.height ?? 0),
              }}
            />
          </div>

          <button
            type="button"
            disabled={!completedCrop?.width || !completedCrop?.height}
            onClick={() =>
              generateDownload(previewCanvasRef.current, completedCrop)
            }
          >
            Download cropped image
          </button>
          <button
            type="button"
            disabled={!completedCrop?.width || !completedCrop?.height}
            onClick={() =>
              fileUploadHandler(previewCanvasRef.current, completedCrop)
            }
          >
            Save cropped image
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
