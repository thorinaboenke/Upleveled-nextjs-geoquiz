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
    object-fit: cover;
    height: 200px;
    width: 200px;
  }
`;

function Image(props) {
  return <img src={props.url} alt={props.alt} />;
}

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
      anchor.download = 'cropPreview.jpg';
      anchor.href = URL.createObjectURL(blob);
      anchor.click();

      window.URL.revokeObjectURL(previewUrl);
    },
    'image/png',
    1,
  );
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
    console.log(e.target.files[0])
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

  const [upImg, setUpImg] = useState();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({ unit: '%', width: 50, aspect: 1 / 1 });
  const [completedCrop, setCompletedCrop] = useState(null);

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

    const image2 = imgRef.current;
    const canvas = previewCanvasRef.current;

    const crop2 = completedCrop;
    const scaleX = image2.naturalWidth / image2.width;
    const scaleY = image2.naturalHeight / image2.height;
    const ctx = canvas.getContext('2d');

    canvas.width = crop2.width * 1;
    canvas.height = crop2.height * 1;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image2,
      crop2.y * scaleY,
      crop2.x * scaleX,
      crop2.width * scaleX,
      crop2.height * scaleY,
      0,
      0,
      crop2.width,
      crop2.height,
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
              onComplete={(c) => setCompletedCrop(c)}
            />
            <div>
              <canvas
                ref={previewCanvasRef}
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
              Save cropped image
            </button>
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
