import React from "react";
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native";

const TransactionResourceLoader = (props) => (
  <ContentLoader
    speed={2}
    width={500}
    height={700}
    viewBox="0 0 500 750"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
    style={{ top: -450 }}
  >
    <Rect x="120" y="460" rx="5" ry="5" width="350" height="40" />
    <Rect x="120" y="520" rx="5" ry="5" width="350" height="40" />
    <Rect x="120" y="580" rx="5" ry="5" width="350" height="40" />
    <Rect x="120" y="640" rx="5" ry="5" width="350" height="40" />
  </ContentLoader>
);

export default TransactionResourceLoader;
