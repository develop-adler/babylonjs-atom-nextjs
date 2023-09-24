import { JSX } from "react";
import Image from "next/image";
import styled from "styled-components";

const PostContainer = styled.div`
  padding: 1rem 1rem 3rem 1rem;
  border-top: 1px solid #353535;
  border-bottom: 1px solid #353535;
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  color: #ededed;
`;

const Author = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const BabylonContent = styled.div``;

const PostStatsContainer = styled.div`
  display: flex;
`;

const StatsContainer = styled.div`
  flex-grow: 1;
  margin-top: 0.5rem;

  &:hover {
    cursor: pointer;
    background-color: #3b3b3b;
  }
`;

// const StatsText = styled.div`
//   font-size: 1rem;
// `;

const AdlerPost = ({ author, content }: AdlerPostProps): JSX.Element => {
  return (
    <PostContainer>
      <Author>{author}</Author>
      <BabylonContent>{content}</BabylonContent>
      <PostStatsContainer>
        <StatsContainer>
          <Image
            src="/icons/comment.svg"
            height={19}
            width={19}
            alt="Comment Icon"
          />
        </StatsContainer>
        <StatsContainer>
          <Image
            src="/icons/repost.svg"
            height={21}
            width={21}
            alt="Repost Icon"
          />
        </StatsContainer>
        <StatsContainer>
          <Image
            src="/icons/heart.svg"
            height={21}
            width={21}
            alt="Heart Icon"
          />
        </StatsContainer>
        <StatsContainer>
          <Image
            src="/icons/eye.svg"
            height={21}
            width={21}
            alt="View Icon"
          />
        </StatsContainer>
        <StatsContainer>
          <Image
            src="/icons/share.svg"
            height={20}
            width={20}
            alt="Share Icon"
          />
        </StatsContainer>
      </PostStatsContainer>
    </PostContainer>
  );
};

export default AdlerPost;
