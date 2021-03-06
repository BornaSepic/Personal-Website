import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import Layout from "../components/layout/Layout";
import {PageTransition} from 'next-page-transitions'
import {AnimationStateProvider} from "../store/context";
import {initGA, logPageView} from "../utils/analytics";

export default class MyApp extends App {
    componentDidMount() {
        const jssStyles = document.querySelector('#jss-server-side');

        if (jssStyles) {
            jssStyles.parentNode.removeChild(jssStyles);
        }

        if (!window.GA_INITIALIZED) {
            initGA();
            window.GA_INITIALIZED = true
        }
        logPageView(window.location.pathname);
    }

    static async getInitialProps({Component, router, ctx}) {
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }

        if (typeof (window) === "object") {
            logPageView(ctx.asPath);
        }

        return {pageProps}
    }

    render() {
        const {Component, pageProps, router} = this.props;

        return (
            <React.Fragment>
                <Head>
                    <title>Borna Sepic</title>
                    <meta
                        key="description"
                        name="description"
                        content="Web developer based in Croatia, focused on eCommerce development and conversion rate optimization."
                    />
                    <link href="https://api.mapbox.com/mapbox-gl-js/v0.51.0/mapbox-gl.css" rel="stylesheet"/>
                </Head>
                <AnimationStateProvider>
                    <Layout>
                        <PageTransition timeout={500} classNames="page-transition">
                            <Component {...pageProps} key={router.route}/>
                        </PageTransition>
                    </Layout>
                </AnimationStateProvider>
            </React.Fragment>
        );
    }
}