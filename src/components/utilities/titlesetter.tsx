import { useEffect } from 'react';

const TitleSetter = ({ title }: { title: string }) => {
  useEffect(() => {
    document.title = `Uranus | ${title}`;
  }, [title]);

  return null;
};

export default TitleSetter;
