import {Helmet} from 'react-helmet-async';

// eslint-disable-next-line import/named
import {CategoryView} from "../../sections/categorys/view";

// ----------------------------------------------------------------------

export default function CategoriesPage() {
    return (
        <>
            <Helmet>
                <title> Categorys</title>
            </Helmet>

            <CategoryView/>
        </>
    );
}
