import React from 'react'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'

export default function MDXRenderer({ source }: { source: MDXRemoteSerializeResult }) {
  return <MDXRemote {...source} />
}
