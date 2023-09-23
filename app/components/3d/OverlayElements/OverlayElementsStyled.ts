import styled from "styled-components";

export const OverlayContainer = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  z-index: 5;
`;

export const ButtonContainer = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5%;
  padding: 1rem 1rem;
  pointer-events: none;
  z-index: 6;
`;

export const ToggleModelEditingButton = styled.button`
  margin-right: 0.6rem;
  pointer-events: all;
  cursor: pointer;
  font-size: 1.5rem;
  color: #ffffff;
  background-color: #8a8a8a;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 0.5rem;

  @media screen and (max-width: 768px) {
    font-size: 0.7rem;
    left: 15.2rem;
  }
`;

export const ModelUploadInputButton = styled.button`
  display: none;
  pointer-events: all;
  cursor: pointer;
  font-size: 1.5rem;
  color: #ffffff;
  background-color: #fc4f91;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 0.5rem;

  @media screen and (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

export const ModelUploadInputField = styled.input`
  display: none;
`;

export const ToggleImageEditingButton = styled.button`
  margin-right: 0.6rem;
  pointer-events: all;
  cursor: pointer;
  font-size: 1.5rem;
  color: #ffffff;
  background-color: #8a8a8a;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 0.5rem;

  @media screen and (max-width: 768px) {
    font-size: 0.7rem;
    left: 7rem;
  }
`;

export const ImageUploadInputField = styled.input`
  display: none;
`;

export const UploadImageGuideText = styled.div`
  display: none;
  position: absolute;
  top: 1rem;
  left: auto;
  right: 1rem;
  font-size: 1.8rem;
  font-weight: 700;
  text-align: right;
  font-family: "Roboto", sans-serif;

  @media screen and (max-width: 768px) {
    font-size: 0.7rem;
    top: 3rem;
    left: 1rem;
    right: auto;
    text-align: left;
  }
`;

export const ToggleAvatarEditorButton = styled.button`
  margin-right: 0.6rem;
  pointer-events: all;
  cursor: pointer;
  font-size: 1.5rem;
  color: #ffffff;
  background-color: #8a8a8a;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 0.5rem;

  @media screen and (max-width: 768px) {
    font-size: 0.7rem;
    left: 7rem;
  }
`;

export const AvatarEditorOverlay = styled.div`
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  width: 33%;
  height: 100%;
  pointer-events: all;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(0.3125rem);
  border-left: 1px solid #000;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const BodyPartSelectionContainer = styled.div`
  display: block;
  width: 100%;
  height: auto;
`;

export const BodyPartSelectionButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

export const BodyPartSelectionButtonContainerLinebreak = styled.hr`
  height: 0.2rem;
  border: none;
  background: #00000066;
  margin: 2rem 1rem;
`;

export const BodyPartSelectionButton = styled.button<{
  $selected?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: auto;
  height: auto;
  border: none;
  border-bottom: 0.2rem solid #fc4f9100;
  border-radius: 0;
  outline: none;
  padding: 1.4rem 1rem;
  margin: 0 0.8rem 0.2rem 0.8rem;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 700;
  background: none;

  ${({ $selected }) => $selected && `border-bottom: 0.2rem solid #FC4F91;`}

  &:hover {
    border-bottom: 0.2rem solid #fc4f91;
  }
`;

export const PartStyleImage = styled.img<{
  $selected?: boolean;
}>`
  width: auto;
  height: 14rem;
  border: none;
  cursor: pointer;
  margin: 2rem;
  outline: 0.01rem solid #000;

  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

  ${({ $selected }) => $selected && `outline: 0.01rem solid #fc4f91;`}

  &:hover {
    outline: 0.01rem solid #fc4f91;
  }
`;
