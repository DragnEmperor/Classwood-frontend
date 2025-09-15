import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReload = () => {
    this.setState({ error: null });
    window.location.assign("/");
  };

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-screen gap-4 p-6 text-center">
          <h1 className="text-xl font-semibold">Something went wrong.</h1>
          <p className="text-sm text-gray-600">
            The page hit an unexpected error. Try reloading; if it keeps happening, contact support.
          </p>
          <button
            onClick={this.handleReload}
            className="px-4 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-800"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
