package com.example.mobile.activity
import android.content.Intent
import android.graphics.Bitmap
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.Interface.IDrawing
import com.example.mobile.Interface.IStory
import com.example.mobile.Interface.User
import com.example.mobile.R
import com.example.mobile.Retrofit.IMyService
import com.example.mobile.Retrofit.RetrofitClient
import com.example.mobile.activity.drawing.DrawingActivity
import com.example.mobile.adapter.DrawingAdapter
import com.example.mobile.adapter.StoryAdapter
import com.example.mobile.bitmapDecoder
import com.example.mobile.viewModel.SharedViewModelToolBar
import com.mikhaellopez.circularimageview.CircularImageView
import io.reactivex.disposables.CompositeDisposable
import kotlinx.android.synthetic.main.activity_profile_modification.*
import retrofit2.Call
import retrofit2.Response

class Dashboard : AppCompatActivity() {

    private lateinit var user: String
    private lateinit var userAvatarBitmap: Bitmap
    private lateinit var rvOutputStories: RecyclerView
    private lateinit var storyAdapter: StoryAdapter
    private lateinit var stories: ArrayList<IStory>
    private lateinit var sessionStartBtn: Button

    private val sharedViewModel: SharedViewModelToolBar by viewModels()

    private lateinit var iMyService: IMyService
    internal var compositeDisposable = CompositeDisposable()

    override fun onStop() {
        compositeDisposable.clear()
        super.onStop()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        user = intent.getStringExtra("userName").toString()
        sharedViewModel.setUser(user)

        sessionStartBtn = findViewById<Button>(R.id.session_start)
        rvOutputStories = findViewById(R.id.rvOutputStories)

        val retrofit = RetrofitClient.getInstance()
        iMyService = retrofit.create(IMyService::class.java)

        stories = java.util.ArrayList()

//        getUserFromDB("miora")
        userAvatarBitmap = bitmapDecoder("iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAXNSR0IArs4c6QAAAARzQklUCAgI\n" +
                "CHwIZIgAACAASURBVHic7Z1Zb+NIsoWPuCQ3ya4FVd3A/P//VQ+DebjdaI+thTt5HzyRDqYoq6q8\n" +
                "KcXzAYJlLRQtk4exZcTqx48fIwghxAOCj94BQgj5WShYhBBvoGARQryBgkUI8QYKFiHEGyhYhBBv\n" +
                "oGARQryBgkUI8QYKFiHEGyhYhBBvoGARQryBgkUI8QYKFiHEGyhYhBBvoGARQryBgkUI8QYKFiHE\n" +
                "GyhYhBBvoGARQryBgkUI8QYKFiHEGyhYhBBvoGARQryBgkUI8QYKFiHEGyhYhBBvoGARQryBgkUI\n" +
                "8QYKFiHEGyhYhBBvoGARQryBgkUI8QYKFiHEGyhYhBBvoGARQryBgkUI8QYKFiHEGyhYhBBvoGAR\n" +
                "QryBgkUI8QYKFiHEGyhYhBBvoGARQryBgkUI8QYKFiHEGyhYhBBvoGARQryBgkUI8QYKFiHEGyhY\n" +
                "hBBvoGARQryBgkUI8QYKFiHEGyhYhBBvoGARQrwh+ugdIB9LEDxes8ZxxDiO9nG5H4YhxnHEMAz2\n" +
                "sSAIsFqtsFqt7GP6vRr9+Gq1Ovo595n6vrwWAIZhwDAMWK1WCIIAYRhiGIbf/MuJj1CwFk5d1wiC\n" +
                "wN60QIzjiLZtsVqtEIahfV7EbU6k9OPjOCIMw9nXyM+57YkgyXNa4ERgAVCsFggFa+HEcWzvz4lQ\n" +
                "HMfWwuq6zt76vscwDKiqaiI4c7cgCBBFEYwxMMYgjmNEUWStJABHFlvf9wBgrSh5PgiCicWnBZZc\n" +
                "PxSshRNFkXW1tGCJJdP3Pdq2RVVVqKoKdV2j73v7OrFytNU0Z2G1bYuyLI/cws+fPyMMQytmYlm5\n" +
                "+zQMg7UC5f2n3FByvVCwFk7TNLPWS9u2GMcRd3d3VrTatrUCpd3IOVzL55T19ffffyOKIiRJgjRN\n" +
                "kaYpkiRBFEWIosfDU8RL7pPlQsFaOG68SCyhw+GApmlQ1/VE0HSQXguJtpy0WEkMTAfK9WfWdY2u\n" +
                "69C2LQ6HA4wxyLIMaZra+/K54zhaV1R/JlkOFKyFIy5hXdeoqgplWaIsSyskSZIciZq4asMwWAFy\n" +
                "kcfSNJ24dWKlyTY2mw36vp/ExkS8oijCzc0NjDFIkmRizWmLkCwHCtbC6fseVVVhu91iv9+jrmsA\n" +
                "sEFyEZuu6+x7JGsYRdEknvVcWYJYWVEUTawwseC09QVgEuAvigKr1QrGGLsteb3eL3L9ULCunCAI\n" +
                "0Pc9+r6fCIY89vfff1sLRywmABNrSn7XzMWS9GtOuWtuJlJbTXNZyqZp0HUdqqrCZrPBZrNBHMfo\n" +
                "+x5lWSKOY/tZen9F0CTbSK4DCtaVI66Xjj+JAFRVZV00HRu6JEQ4m6bBw8MD2rZFnufI8xzr9RpN\n" +
                "0xwJlQgYxer6oGBdObqGSSyrsiyx3W5RluWkgl3QFstHI7VWEtuq6xpt2yIIAmtd6ZosXRbBOq3r\n" +
                "g4J15Ui8CYANZu92O2tdzS2XAS5DrDS6Lkzqueq6xs3Njf0b9b5f2v6T14GCdeXIidx1HcqyxMPD\n" +
                "A8qyxDiONkM4J1Zza/k+Ah2g15nKw+GAqqps5bwxxlpi2j2kcF0X7NZw5UhtlVhWZVmi67qj9YHu\n" +
                "OsJLQRZf68SBziRut1tUVTWJV1GkrhdaWFeOWFYSsxLLSqyuU27UpYiXKz56wTQAbLdbayXqItO5\n" +
                "9xL/oWBdOSJY+/0eXdfZhcdd16FpGltrpdFWzEef9G45hq6wl+ymPB9FEdI0RRAE9rlTS4eIn1Cw\n" +
                "PEesC3HvZM2fnMT//ve/ATyKkHRmkGJLXYjp8tFCJci+uSUXYkkZY9D3PR4eHuw+S3W+uJPkeuDl\n" +
                "5wrQWUDg8YQFgIeHhw/bp/dCLCwJxB8OByvirMO6PihYnqPX1MnJG4Yh2rbFf//734/evTdH3L5x\n" +
                "HG2sTopJyfVBwfIciddINTvwuD5P0v5LQK9lrKoKDw8PqOvatqch1wMFy3OCIEDXdRjHEXEcYxgG\n" +
                "PDw8YLfbLSLgrNcLSnfUh4cH7Pd7CtYVcv1H9JUj5QiS2WuaBtvtdjEWhriD0t1UvoOyLBdjYS4J\n" +
                "Cpbn9H1/dKLq+qoloMsdJDvati3u7u4+etfIK0PB8hxpCRMEAeq6tv2lltJaRcfuJEsqtWX39/cf\n" +
                "uWvkDaBgeY5kCbuuw263w3a7tRbWkqwsmcwjFfwS1/vrr78QRRHiOEbTNACe4l7MJPoHBctzJEso\n" +
                "7YWXJlTnkOaEutWMjvkRv6BgeY60CZYe7MDltoj5CJqmsXVZkoSgYPkLBctzxB2sqmqRruA5ZC2l\n" +
                "XleoW+oQv6BgXQHSiVOfiLSuHpEhG9KlVKBg+QkFy3NkdJbEaYBpbdbSkc6kkkHUj1PU/YOC5TnS\n" +
                "RkVKGORE5Mn4iO5g4XZSvcShG+R5KFieo4eSus34aGHBdm1w5yrSwvITCpbnDMOA3W5nf5fg8tw0\n" +
                "nCXS9z2iKLKDN+I4tnVa0paH+AMFy3NEmFx3h9nCY+baLRO/oGB5zlzFNgVriivoAPj9eAoFy3Pm\n" +
                "qrgBLKK1zM+gWywztuc/PKo9RywsnR3kCTlFOjlc4lQg8mtQsDxHlzNoeEI+ooVcyhj43fgLBctz\n" +
                "3HVxOl7DoPIT/E6uAwrWlTC3JIcn5xP8Lq4DCpbnuENDZRYfq7if6PvezmSUhn+6kJT4AwXrCmFZ\n" +
                "wzFz3wW/H/+gYHlOEARH6wd5Ik4R8ZbvivgLBctzZACFCy2sJyhW1wMFy3OiKJpYWRoGmh8RwaJo\n" +
                "+Q8Fy3OiKDq5iJeC9cgpwaJ4+QcFy3NcC8tt4keYhLgmKFieI5aDhkWSx7hixe/GTyhYnjOOI5Ik\n" +
                "sXVYSZJwKoxiHEcYY5DnOZIkAXC8YJz4AwXLc2Q0exRFGMfRri1kt4ZHZDK2jPgahsFapbSy/INH\n" +
                "9RWQJAnSNMU4jraCmyfkI+M4Io5jO75eJgvJigDiFxSsK8AYgzRN7TIdgBkwIQgCGGMQx7EVLFpY\n" +
                "/kLB8hyxIJIksevlyBMiVuIi6/geBcs/KFieIy6OWFlRFNlJOrSygDzPbfwKmO9qQfyBguU5Ur4Q\n" +
                "RRHSND2K1SydPM8RhuHEVWY3C3+hYHmObossVe8UrCeMMZOhqbSw/IaC5TlhGKJtWwzDgKIocHNz\n" +
                "gzAM0fc9VqsVuq5D3/eTYasSz5ESCJ+RQaliZQJA27YwxuCPP/6YrAQQ2NXCX6LzLyGXjLYcxMpK\n" +
                "0xTDMMwOC9UV8NdQq6WzfiLKURTBGANjzEfvHnll/D9iF4500BSSJMFms0Gaprb6XSwMN35zLZOP\n" +
                "tcUolf+6sp1cD7SwPEe7eFLVXRQF2rZFXddHFpheZ3gNLpEW4WEYYIxBURTIsoylC1cILSzP0Z0a\n" +
                "xMKI4xh5niPP88nJrBvZXcviaCkAlZhdlmUoigJxHDMTeIVQsDxHF0TKT6nLWq/XNksmAqVffw2C\n" +
                "JX9bEATI89z+zQAoWFcIBctztHsn1pPEroqiwGazsbGca3IFNavVCmma4ubmBkVR2AD8tf2dhILl\n" +
                "PdrdkyC6WBbiGsZxfJXxK+ApS5gkCYqisO11JJ5HrgsG3T3HnfgMYBKEz7IMwGNn0v1+j6ZpADxm\n" +
                "CN3F0q6gXULQWtw9Kf6U0oUwDG0N2tevX/H582cEQYCmaezr27alaF0ZFKwrR6wPHc9p29ZaIW5L\n" +
                "ZS1WlyBYACY9vqTvV9d1qOsaX758QZqms6POrsWKJE9QsK4cKaQsisKe1Pv93lbAu27kXEX4R6Pr\n" +
                "zMT9jaIIcRzj06dPSJLExu40FKzrg4J15Ui1u1haUvpQliXatrUiJif3Jca6tIvX9z2MMbi9vbUJ\n" +
                "Be3akuuGgnXl6PosKSqV+E9Zlqjr+ij2peNFlxAD0usg0zRFURS4vb3Fer1G0zSz8btLElzyelCw\n" +
                "rhxprSLBa2OMtbjiOMY///xjxUkE6pLGYmlXL89zK1RBEKCqqonb6lbzk+uDgnXl6PiPtjqSJLHd\n" +
                "Deq6RlVVNhgvXIJgibBK2UJRFIiiCH3fo21b+ze42VL2bb9OKFgLQJaviBUlj8VxjG/fvmG/3+P+\n" +
                "/t4G4y/pJF+tVliv17i9vYUxBl3XoaqqyUgzvb86eRAEwVW00CFPrH78+HE5Ryd5d7QL1bYtyrLE\n" +
                "fr/H4XBA0zQnOx6ISMhwB7dMQm//OeI4Rtd16LrOZgBlyk0URfjzzz9f5w8lVwEtrIUjIiFCIa5U\n" +
                "mqboug7b7Xa2vkliXXVdT7an419up0+diZT7+/3elinIuLIsyyYuKyECj4iFowtFgyBAGIa204EE\n" +
                "4SVe1Latrd8SV8sVFVewpLL+VCBchkQYY5AkiZ3+E0XRbG0VWTYUrIXjBuUBWAsqDEN8/foVfd+j\n" +
                "aRo0TYO6rq1w6ZIJ9yaIS6lFTLcs/vz5s/0syV7q7V5DV1TyelCwCIDTrVjiOEYYhjDGWKtLLKxh\n" +
                "GLDf7ycBfYlj6RiXWG5RFNmbiJPrJrpLgi4pAUA+HgoWOeqlBTwJiFTDi+jITcQpz3P7Xte60u+X\n" +
                "beh2zTrG5b7/ktYyksuBgkUmmTwtWIJbEqEtKbeBoK6Wl0C+FiPXCtOlCa5guftBCAVr4cwJwrnJ\n" +
                "OmJluVlAdzmMlEroz3Ir6MUCE7TgyTYIEShYC2dOEH62Y8NzNVeupXSKU0F1ChWZgykYQog3ULAI\n" +
                "Id5AwSKEeAMFixDiDRQsQog3ULAIId5AwSKEeAMFixDiDRQsQog3ULAIId5AwSKEeAMFixDiDRQs\n" +
                "Qog3ULAIId5AwSKEeAP7YXnOqUZ38nsURbNDIuT5MAyPtuXed7f/Wr2qdLO/uc889Z65x+ZG1usW\n" +
                "y+739LP9ushlQcHyHHcMlnsCypitUz3VdUdQ3V9db39u4o003uu67tn9E0E8JQx6+MXc57tzDfX+\n" +
                "a+bGiOnH5gSN+AcFy3POjcHKsuxoqo3uq56m6eT1p3qpu9OdRajOfb4WtLltu/fdz9UWoLsvcv/U\n" +
                "e93Xzn0eO5v6BQXLc065bvLzcDhMLBMZlCpC0zTN5D2uy1jXtRUqGaIqY+XlseeI43iyn+4E6CzL\n" +
                "jqbqyA0AjDFHf6/ehkyu1ughF9J7nsJ0HVCwPOfUiSgnsZ7MrC0jed9+v5/MGuy6zgqTnPj69e5P\n" +
                "V1BcyrKc7I8rWNvtdlas9NQdd66hzEoUAda4Y8PcqT5vEYsj7wcFy3N+ZjKyjJqv6xpVVdnpzX3f\n" +
                "zwbltVCJ4LmWjfw8Z2FpQZtzBdu2tZ8r8TjXYtKTqPUQ1iAIkCSJfV6eEytSx+j0fs+NEyN+QMHy\n" +
                "HDkBxUpyraO7uzsA8+7earVCXdcTl0xOfDeoPidm4nI9R13X9rPmkFH2pywfsZjEApQkgiD7KpZX\n" +
                "HMcwxljLrO/7I8tNfw4Fyy8oWJ4jAiUWlNzEgnLn/On7rkulrRzBff+vnuASw9KfoXEtIHcffzao\n" +
                "L0LmitOXL1+soDE76D+rHz9+0JF/Q4IgmLVu5KTSAqHLBcSacV0xHWvq+x5///23ff3c7WdcxmtG\n" +
                "vrsoimCMQZIkSNMUSZIgiqLJ9y/Wo46puTExt7TCFXjyttDCemO6rptNpYsgRVFk3Tl3crJYQMMw\n" +
                "oK5rNE1zFINyg8oaWhNPdWpihVZVhcPhYGNd6/V64k6KlSmvlxicLjzVbvHSLwjvDQXrjXELNV1L\n" +
                "yx3lrgVoHEfc39+j73srWE3T2LIC4CkGJO/R2yKPdVw6qC9CJP+PqqpgjEGapkjTdBITA+Yr47Wb\n" +
                "rAtfydtDwXpj5IQBpge9a02JsA3DgKZprBW13W4nxZ7yWonJ6Epw4WdHzS8B90KhHwMeyzrKssTh\n" +
                "cEAcx0iSBFmWIU1Tm2l0LzIAbFkFBet9YQzrHdCxEblCywkQxzGGYUDbtlaoqqpCVVVomuZsFm4O\n" +
                "CtYT7t8/lzxwY35xHFvBurm5mSxH0tbaOI6TOjfy9vDbfkck+KtLEQ6HA5qmQVmWqKrKBtNF4LTQ\n" +
                "uVf7U0H1pYvUc7jWrnbZ5TttmgZt2yIIApRlCWMM8jy3LqO8lgH394eC9caI6wBM3T6JSd3f36Pr\n" +
                "OhtEl/fI+5qmmQjWXPEmOc1zgj6OoxUmKUZ11yk+PDwgiiJUVYUsy5BlGYwxNutIl/B9oUv4xuiT\n" +
                "QMSqqirsdjuUZTm7OFgXgrrBX5dTC36fe35J6LWGp74r/b27rruULsh2kiRBURRYr9dIkoTW7DtD\n" +
                "wXohIkK6RgeAXZOXJIkNvB8OBzw8PGC/39tyh6ULyqXj1sK5Vu6ff/5pSyJWq5V16fUCbl0KoY8R\n" +
                "8uvQJXwFRJB094IoipCmKaqqsvGpsixR17U9oNlF4PI5Z8He3d3BGIMsy2wxqlzEuq6zlf6uSLGw\n" +
                "9/egYL0CbiGhCFHbttb1OxwOtv6HLU/8wRUsnQwBgN1uhzAMUdc1iqKwMS4RIsa4XhcK1iugU9yy\n" +
                "3GO73WK329mMk1hVUpgoRYy/U7ZA3o9TFpau6er73sYjtXDFcTxJmrixRYlvkp+HgvUK6Gpqcf0k\n" +
                "VgU8LbHRWUJ2CvCPU8ufRIyk2LdtW3RdZ60t+T/r4t85ESPnoWC9EGmxIkH1+/t7HA4HDMMAY4xN\n" +
                "m4tQiVhJzybW8lw25wSl6zp7MZK4lSRVDocDvn//PimbAJ5CCHQXfx0K1guRK6uUKsjBKq6e276F\n" +
                "V9TrQhfxajdP6uzCMESaptZFdC0rWtm/BgXrhQzDgO12i/v7e3uAJkmCrutQlqVdnCxuoQgYK6X9\n" +
                "4FxNmyyt0us85X3DMOCvv/7Cer3GOI4oisJmEcnvwTqsM0iAXK6gkuGTOqv//Oc/ANiPiswjx0oQ\n" +
                "BLi5ucHXr1+R5zm6rkNVVROrS3CXD5EnaGGdYe4KK9aTTJRxX+e+niwbiWE2TYPtdou+720zQV0S\n" +
                "AxwfbxStKRSsM8xVsEu8qqqqZw82QrSVXdc1uq5D0zS4vb1FURSTpUNuuQQ5hoJ1BsnoiWlflqUt\n" +
                "BpUMIMB+VGQeLVjSPFBq9lar1aSjqRtKoGgdwwDLGdw6m/1+j8PhYOMSwlyTN0KA437wfd9jt9vh\n" +
                "7u5u0j2WInUeWlhnEMuqaRrbnVLWC0q/dReKFhF0HEoLkrS7luJSWSTPBfHPQ8H6CSRm5VpWLPwj\n" +
                "v4LbymYYBtzf3yPPc9u6xu0GQabQJfwJxLqqqgoAbPzh1NRjuofERY4HyQrKutLD4WA7zbo95yla\n" +
                "x9DC+h9ygOhFyXEc459//sFut5sssTnXz5sHGnGZ6/oAPIYVyrK08a0sy+zzrOE7ZvHfiLaCJMUs\n" +
                "awNlIbNkdub6qhPyEuR4appm0oJILoxkyuItLN3fSK5qYRhO4lZ935+sRqY1RV6CHD91XWO1Wtnu\n" +
                "pWEYTspmyCP8Nv6H289bmu9JbMHtuABw6i95HeQ4qqoK+/3eDtflxfAYnnEO0im0rmvUdT1puqdb\n" +
                "grBmhrwGwzBMJk3XdW2z0Zx5eMziBUt3fZSeRtKDXSwrt48RMzjktdDB9zAM7WqKpmlowc+w+G9E\n" +
                "4lcSbO/7HofDwVpXuumevJ492clr4cZPAdj+aqfKZpYMBcupRJYhp9KET2bS6YNKx7MIeQn6oqiz\n" +
                "g9JmmUxZvGABT26hdIkEnuYN6o6hcl/PniPkJehBJFLf17Yt9vs96rr+4L27PBZ/xslBIkhfbrGs\n" +
                "CHlLdIdSHR9lyGGexQuWdgcB2BHxuk8RIW+Fm9ABnsIULBw9ZvGCJdkZfZDoindC3hK3aZ+EJ2TG\n" +
                "IZmyeMHSM+NkHaGeHUfIW+L2ypJjTgLvZMriBUuKQedqrBhDIG+NG7cSdDEpeWLxgiUEQYA4jpGm\n" +
                "KZIkselmQt4LXTqTpik2m81H79LFsXgJF1Nc4lh93yNJkqPsISFvgbas9LKvJEnskAryxOItLDkg\n" +
                "mqZBWZaI4xjfvn3DZrOxDftE0OT1nBtHXgtpJxNFkY2f3t7e4vPnzxSrGRYvWG6XRwB2erNc4eRA\n" +
                "kip3Dkklr4VMjpZWMlmWIU1TZqhPsPgzbk6w5MD59OkToiia1MRokaJgkZeiLaskSbDZbJBlGQXr\n" +
                "BDzj/ofbTTSOYxRFgfV6PTmodK0MXULyUiTEEEURiqJAURSI4xgAQw5zLF6w5nptS+wgjmPc3t4i\n" +
                "yzI7T06noVmJTF6K9L0SsTLGWIuegnXM4gVrDh1YT9MU6/UaeZ7bUgcRLAZFyUtZrVbIsgw3NzdI\n" +
                "03QyWYccw7IGtcjUdQuBR4srz3P7mGQO2cSPvAZJktgLoljtOuxApizewtITcORAcSf0SjxLzHX9\n" +
                "WkJeQpqmyLLMZgtFsKQukExZ/fjxgzJ+BnEDh2HAbrfD3d0d6rq2C6d1kz8teHQbSRzHqKrKTnbu\n" +
                "+x51XcMYg9vbW3z9+vWjd9ErFu8SnkO7fqvVCsYY6yLqxaluGprmPAEw6c0uzSGzLMN6vUZRFB+5\n" +
                "a15CwfoJdDxB1hkCwP39vS0onRuyKq4jWS7DMNhavq7rEMcxNpsNbm5uEMcxL2y/CAXrDLpN8jiO\n" +
                "CMPQ1mX1fY+yLG0aWsfAdJ9uslzk4qat8zzP2YnhN+G3dgYRLN1yJgxDm9VZrVZ2yokUnOolPGTZ\n" +
                "BEFga61ubm6w2WysZSXWOfl5KFhn0GPAgKdGf0EQoCgKe18arrkdJAkJwxBpmqIoChv/5ESc34OC\n" +
                "dYYoimbHMMkK+zzPrQUmAzC1e8gs4bKRC9t6vYYxxq6O4JCJ34OCdYYoilDXNYZhsGu8JH4FwLqA\n" +
                "wNOY+7ZtEYYhzX2CKIpwe3uLzWZjQwdRFCEMQwrWb0DBOkPTNLaQT6wlqb8CYF3CPM8BPIrWfr9H\n" +
                "3/fouu6oHY1kFHXLGnK56LZCUlfnuvz6uNCL59M0xffv3wHADpRIksRumx0Zfh0K1gvRJn6apgAe\n" +
                "D0QZhKkFS7epERHkVfay0Y0bgeMpN/LTTcoURYGbm5sP2OPrhoL1QrToyIEaRZGNYYmF5g624LBM\n" +
                "PxCrSk9S0lax7tohjR/zPLfrAzn55nWhYL0QXZMlV1djjF19/3//93+z6w91GxtyubguoMQm9f9U\n" +
                "Mn7GGHz69Anr9RpBEFCs3gAK1gtx3QPJEBpjYIxB0zSo6xplWU6yh/Jelj5cNnOWlYiYPGeMsW2I\n" +
                "xMKWMhdJ1JDXgYL1QvQiaB2UlSD7t2/fsNvtsFqtsN/v0XXdZDkPuWx0sgTA0aDd1WqFzWaDz58/\n" +
                "I45ju7gZYFD9LaBgvRI6ACuCJevIpCo+iiLs93s0TWNPBMawLh/deUN3ozXGIMsybDYbJEkyeZ4X\n" +
                "pLeBgvVC5lra6iD74XCwwwWMMQiCANvtlvENj3A7dsjSrCzL8OXLF4zjiKZp0HWdDbwDTyO8yOvB\n" +
                "flhvjO4FL1fdqqpwf3+P3W6Htm0RRZHNLOqiVHmvm2XUVhnruF6GrrMCjpMhURSh6zorRtIaJs9z\n" +
                "xHFMQXpnaGG9MTqmBTyt2r+5uUGSJCjLElVV2dbLcRzbxbF938/GQXQ7Gw7CeBkSe9S1csBTkF2s\n" +
                "pDRNkSQJsiyzHUJ1MTF5HyhYb4y2hmQ9onYpjDG2X1Lbtidb0rh95nllfx3c3vz6e5b/hQzVzfMc\n" +
                "xhgrcvwfvD8UrDfGbewny3XkJoKVZRn2+z32+72Nb4kl5ZZO6MkqzES9DL2ofU6Ebm9vbTGoMeYo\n" +
                "+E7eFwrWO6A7N8hNBCwMQ8RxjCRJYIxBHMd2WY9293RzQGCaXie/j/sdBkFgM4CycNmNMbplDeT9\n" +
                "oGC9Mdp9cy0mAHaIxTiOMMbgy5cvyPMcDw8Pk7otCdqzC8Troq1fEas8z1EUBdI0nQTjdSZ47n9J\n" +
                "3h4K1hujTwidGgcwiUmJayLuoQR6D4eDrZYXi4snyesiFpUxBkmSTKxdtykj66s+FgrWGyOC5boR\n" +
                "7kkglpYeCbVer7Fer3E4HLDdblGW5STmAhy7NOTXkazter22Gdqu61BV1aS4V/5PwFNPNMYQ3xfW\n" +
                "YV04usq6qirsdjtbLd/3PdI0tW2b3WGwwNSKm8MVQNf6+2jO7Ycxxv794jrLd6AvDu6aQFlO9a9/\n" +
                "/es9/gzyStDC8gA5EaMownq9RpIktrL6/v5+IlIS3HctgLn0PTDv4lxS+YS2YNyi2XEcrUUqyQu3\n" +
                "wFZnVKUGLssy5Hk+aaZH/ICC5QFy4kVRhCRJrMsirZi7rkPTNGjbdjLcQFtaWnh0plK6CVyKReXi\n" +
                "CpRGYn5yX4uTbgsj3T/zPEeaprboUyxX4g8UrAtnzhISiyqOY3z//h11XWO/39shGPpkPeUS6lmL\n" +
                "rii47uFHMidSGqk2l2wqgEk2VeqnsixDkiSToaZ933M+oGcwhnXhiFunm8ad6ggwDAPatkVVVTa7\n" +
                "2HXd0fo4fUJL5wiNLqL8aMtrrqOF/l23nI6iaJLpi6IIm83GWpT6tayh8hNeXi4cd32ba0XohdKy\n" +
                "DlEqs2UytTSTEwETYZP3yedoLkWw3LWS7v5IgWeSJHa9n0wycnuu63bWFCs/oWBdOHpxLoCjmJSI\n" +
                "lhYg3YMrTVM7wUfqueq6ti6RnMQ6rnVJmULJYurMnliHq9UK6/XaBtyjKLIWmZt4kGp12SZdQj+h\n" +
                "S3jhSIxGj5KaW8+mU/lSla1PSN3CWdqlDMOA7XY7ObndbV6CaOnlS7qoU74LYBqr01apxKzc3ux6\n" +
                "bBfxBwrWwnEXZjdNg6qqrBWms45zAfxzhZM/IwiSzZQBo2IpBUGAT58+/eZfRq4R2sMLRzcIlOUp\n" +
                "eZ5PFmhri00sNHl+v98/u33Z9pxLFwQBkiQ5qiPTg0svwcIjlwMFa+G4rVVEPICnEgfdH8p1uf74\n" +
                "449nty8W2tznyDbdMgodEGeDQqKhYC0ctzXwXP2WK2b696Zpnt1+lmVH23cD/M+5jexMQTQUrIXj\n" +
                "CpQrSK6YzAW1n6MsS3t/zpI6J0h0CYmGgrVwpAzgVFtmXbg5Jx7npv/otYzyU7uEOqjP2ihyDgoW\n" +
                "mWQKdVW8CJZ+nXs7lyXUPbzm1gWeEym6hERDwVo4MhVGW0BahOYydW7N03NoQXKrz91tzX0Gde7K\n" +
                "cAAAASRJREFUIRoK1sI5ZyH9iiCd42cEjpDnoL1NCPEGChYhxBsoWIQQb6BgEUK8gYJFCPEGChYh\n" +
                "xBsoWIQQb6BgEUK8gYJFCPEGChYhxBsoWIQQb6BgEUK8gYJFCPEGChYhxBsoWIQQb6BgEUK8gYJF\n" +
                "CPEGChYhxBsoWIQQb6BgEUK8gYJFCPEGChYhxBsoWIQQb6BgEUK8gYJFCPEGChYhxBsoWIQQb6Bg\n" +
                "EUK8gYJFCPEGChYhxBsoWIQQb6BgEUK8gYJFCPEGChYhxBsoWIQQb6BgEUK8gYJFCPEGChYhxBso\n" +
                "WIQQb6BgEUK8gYJFCPEGChYhxBsoWIQQb6BgEUK8gYJFCPEGChYhxBsoWIQQb6BgEUK8gYJFCPEG\n" +
                "ChYhxBsoWIQQb/h/IPx45zBZ72EAAAAASUVORK5CYII=\n")
        storyAdapter = StoryAdapter(this, stories, user)

        //Recycler View of rooms
        rvOutputStories.adapter = storyAdapter
        rvOutputStories.layoutManager = GridLayoutManager(this, 3)

        val testDrawing = IStory("test", userAvatarBitmap, "")
        storyAdapter.addDrawing(testDrawing)
        storyAdapter.notifyItemInserted((rvOutputStories.adapter as StoryAdapter).itemCount)

        sessionStartBtn.setOnClickListener{
            openSoloDrawing()
        }
    }

    private fun openSoloDrawing(){
        val intent = Intent(this, DrawingActivity::class.java)
        startActivity(intent)
    }

    private fun getUserFromDB(user:String) {
        var call: Call<User> = iMyService.getUserFromDB(user)
        call.enqueue(object: retrofit2.Callback<User> {
            override fun onResponse(call: Call<User>, response: Response<User>) {
                userAvatarBitmap = bitmapDecoder(response.body()?.avatar)
            }
            override fun onFailure(call: Call<User>, t: Throwable) {
            }
        })

    }
}