import React from 'react';
import styled from 'styled-components';
import AdlerPost from './AdlerPost';

const FeedContainer = styled.div`
  width: 100%;
  max-width: 60%;
  margin: 0 auto;
`;

const AdlerFeed = ({ posts }: AdlerFeedProps): React.JSX.Element => {
  return (
    <FeedContainer>
      {posts.map((post, index) => (
        <AdlerPost key={index} author={post.author} content={post.content} />
      ))}
    </FeedContainer>
  );
};

export default AdlerFeed;
