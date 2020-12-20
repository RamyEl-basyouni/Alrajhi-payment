import React from "react";
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native";

const HomeSkeletonLoader = (props) => (
  <ContentLoader
    speed={2}
    width={500}
    height={700}
    viewBox="0 0 500 750"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <Rect x="131" y="28" rx="10" ry="10" width="331" height="105" />
    <Rect x="164" y="152" rx="13" ry="13" width="256" height="189" />
    <Rect x="89" y="161" rx="13" ry="13" width="61" height="179" />
    <Rect x="432" y="163" rx="13" ry="13" width="65" height="176" />
    <Rect x="184" y="357" rx="13" ry="13" width="309" height="71" />
    <Rect x="351" y="421" rx="13" ry="13" width="6" height="0" />
    <Rect x="88" y="359" rx="8" ry="8" width="77" height="68" />
    <Rect x="120" y="460" rx="5" ry="5" width="350" height="40" />
    <Rect x="120" y="520" rx="5" ry="5" width="350" height="40" />
    <Rect x="120" y="580" rx="5" ry="5" width="350" height="40" />
    <Rect x="120" y="640" rx="5" ry="5" width="350" height="40" />
  </ContentLoader>
);

export default HomeSkeletonLoader;
