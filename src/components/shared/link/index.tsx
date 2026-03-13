"use client"

import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { ReactNode, FC, useEffect, useRef, useState, HTMLAttributes } from 'react';

type CustomLinkProps = NextLinkProps & {
    children: ReactNode;
    href: string;
    target?: string;
  } & HTMLAttributes<HTMLAnchorElement>;
  
const Link: FC<CustomLinkProps> = ({href, children, ...rest}) => {
    const [prefetch, setPrefetch] = useState(false)
    const linkRef = useRef<HTMLAnchorElement>(null)
    const applyPrefetch = ()=>setPrefetch(true)
    const removePrefetch = ()=>setPrefetch(false)
    useEffect(()=>{
        const linkEl = linkRef.current
        linkEl?.addEventListener("mouseover", applyPrefetch)
        linkEl?.addEventListener("mouseleave", removePrefetch)
        return () => {
            linkEl?.removeEventListener('mouseover', applyPrefetch);
            linkEl?.removeEventListener('mouseleave', removePrefetch);
        };
    },[prefetch])
    return (
    <NextLink href={href} ref={linkRef} prefetch={prefetch} {...rest}>
        {children}
    </NextLink>
  )
}

export default Link