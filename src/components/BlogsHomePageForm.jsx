import { client } from "../../lib/contentful/client";
import BlogCard from "@/components/BlogCard";

const BlogsHomePageForm = ({ posts }) => {
    return (
        <div className="main-content">
            <h1 className="golden-ratio-3 text-center text-white">Blog Home Page</h1>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-10">
                {posts.map((post, i) => (
                    <BlogCard key={post.fields.slug} post={post} />
                ))}
            </ul>
        </div>
    );
}

export const getStaticProps = async () => {
    const response = await client.getEntries({ content_type: 'post' })

    return {
        props: {
            posts: response.items,
            revalidate: 60
        }
    }
}

export default BlogsHomePageForm;