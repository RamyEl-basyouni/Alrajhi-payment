import React from "react";
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native";

const CategoryResourceLoader = (props) => (
  <ContentLoader
    speed={2}
    width={500}
    height={700}
    viewBox="0 0 500 750"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
    style={{ top: -320 }}
  >
    <Rect x="184" y="357" rx="13" ry="13" width="309" height="71" />
    <Rect x="351" y="421" rx="13" ry="13" width="6" height="0" />
    <Rect x="88" y="359" rx="8" ry="8" width="77" height="68" />
    <Rect x="120" y="460" rx="5" ry="5" width="350" height="40" />
    <Rect x="120" y="520" rx="5" ry="5" width="350" height="40" />
    <Rect x="120" y="580" rx="5" ry="5" width="350" height="40" />
    <Rect x="120" y="640" rx="5" ry="5" width="350" height="40" />
  </ContentLoader>
);

export default CategoryResourceLoader;
