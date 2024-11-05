import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { getStaticPageContent } from '~/APIs/static';
import MainLoading from '~/components/common/Loading/MainLoading';

const StaticPage = () => {
  const { slug } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['page', slug],
    queryFn: () => getStaticPageContent({ slug }),
    enabled: !!slug,
  });

  if (isLoading) return <MainLoading />;

  return (
    <>
      <Helmet>
        <title>{data?.title || 'BMT Life'}</title>
        <meta
          name="description"
          content={data?.metaDescription || 'BMT Life'}
        />
        <meta name="keywords" content={data?.metaKeywords || 'BMT Life'} />
        <meta property="og:title" content={data?.metaTitle || 'BMT Life'} />
        <meta
          property="og:description"
          content={data?.metaDescription || 'BMT Life'}
        />
      </Helmet>
      <section className="max-w-container mx-auto mt-16">
        <div>
          <h1 className="text-3xl font-bold mb-4 uppercase text-gray-900">
            {data?.title}
          </h1>
          <div
            className="text-gray-700"
            dangerouslySetInnerHTML={{ __html: data?.content }}
          />
        </div>
      </section>
    </>
  );
};

StaticPage.propTypes = {};

export default StaticPage;
