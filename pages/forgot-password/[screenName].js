import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import TemplateView from "../../components/TemplateView";

const ForgotPassword = () => {
  const router = useRouter();
  const { screenName } = router.query;

  console.log("-----> screenName", screenName);

  const ScreenComponent = dynamic(() =>
    screenName === "reset-successful"
      ? import("../../components/forgot-password/ResetSuccess")
      : Promise.resolve(() => <p>Screen Not Found</p>)
  );

  return (
    <TemplateView>
      <ScreenComponent />
    </TemplateView>
  );
};

export default ForgotPassword;
// import { useRouter } from "next/router";
// import dynamic from "next/dynamic";
// import TemplateView from "../../components/TemplateView";

// const ForgotPassword = () => {
//   const router = useRouter();
//   //   const { name_of_screen } = router.query;
//   const { "forgot-password": forgotPasswordScreen } = router.query;

//   const ScreenComponent = dynamic(() => {
//     console.log("-----> forgotPasswordScreen", forgotPasswordScreen);
//     if (forgotPasswordScreen === "reset") {
//       return import(`../../components/forgot-password/ResetPassword`).catch(
//         () => () => <p>Screen Not Found</p>
//       );
//     } else if (forgotPasswordScreen === "successful") {
//       return import(`../../components/forgot-password/ResetSuccess`).catch(
//         () => () => <p>Screen Not Found</p>
//       );
//     } else {
//       return import(
//         `../../components/forgot-password/${forgotPasswordScreen}`
//       ).catch(() => () => <p>Screen Not Found</p>);
//     }
//   });

//   return (
//     <TemplateView>
//       <ScreenComponent />
//     </TemplateView>
//   );
// };

// export default ForgotPassword;
