import AddResourceFilePage from "@/pages/dataoffering/resources/addresource/file/AddResourceFilePage.vue";
import AddResourceDatabasePage from "@/pages/dataoffering/resources/addresource/database/AddResourceDatabasePage.vue";
import AddBackendConnectionDialog from "@/pages/dataoffering/backendconnections/dialog/AddBackendConnectionDialog.vue";
import dataUtils from "@/utils/dataUtils";
import errorUtils from "@/utils/errorUtils";
import validationUtils from "../../../../../utils/validationUtils";
import clientDataModel from "../../../../../datamodel/clientDataModel";

export default {
    components: {
        AddResourceFilePage,
        AddResourceDatabasePage,
        AddBackendConnectionDialog
    },
    props: ['fromRoutePage'],
    data() {
        return {
            search: '',
            headers: [{
                text: 'URL',
                value: 'accessUrl'
            }],
            backendConnections: [],
            sourceType: "",
            sourceTypeItems: [],
            selected: [],
            validLocal: false,
            validRemote: false,
            validRoute: false,
            defaultRule: validationUtils.getRequiredRule(),
            numberRule: validationUtils.getNumberRequiredRule(),
            allValidRemote: false,
            readonly: false,
            newBackendConnection: false,
            file: null,
            loadedFile: null,
            filetype: "",
            hideBackendConnections: false,
            editMode: false,
            active_tab: 0
        };
    },
    watch: {
        validRemote: function () {
            this.$data.allValidRemote = this.$data.validRemote && (this.fromRoutePage == 'true' || this.$data.selected.length > 0);
        },
        selected: function () {
            this.$data.allValidRemote = this.$data.validRemote && (this.fromRoutePage == 'true' || this.$data.selected.length > 0);
        }
    },
    mounted: function () {
        this.getGenericEndpoints();
        this.$data.editMode = false;
    },
    methods: {
        gotVisible() {
            this.getGenericEndpoints();
        },
        previousPage() {
            this.$emit('previousPage')
        },
        nextPage() {
            this.$emit('nextPage');
        },
        backendConnectionSaved() {
            this.$data.newBackendConnection = true;
            this.getGenericEndpoints();
        },
        async getGenericEndpoints() {
            try {
                let response = await dataUtils.getGenericEndpoints();
                this.$data.backendConnections = response;
                this.$data.readonly = this.$parent.$parent.$parent.$parent.readonly;
                this.$forceUpdate();
                if (this.$data.newBackendConnection) {
                    this.$data.newBackendConnection = false;
                    this.$root.$emit('showBusyIndicator', false);
                }
            } catch (error) {
                errorUtils.showError(error, "Get backend connections");
            }
        },
        async loadResource(resource, hideBackendConnections) {
            this.$data.hideBackendConnections = hideBackendConnections;
            this.$data.loadedFile = null;
            if (!this.readonly) {
                this.$data.editMode = true;
            }
            if (resource.fileType === undefined) {
                this.$refs.form.reset();
            } else {
                if (resource.fileType !== undefined) {
                    this.$data.filetype = resource.fileType;
                }
            }

            this.$data.selected = [];
            if (!hideBackendConnections && resource.artifactId !== undefined && resource.artifactId != "") {
                try {
                    let route = await dataUtils.getRouteOfArtifact(resource.artifactId);
                    if (route == null) {
                        this.$data.active_tab = 0;
                        let artifact = await dataUtils.getArtifact(resource.artifactId);
                        this.$data.loadedFile = {
                            name: artifact.title,
                            link: artifact._links.data.href
                        }
                    } else {
                        this.$data.active_tab = 1;
                        let ge = route.start;
                        let dataSource = ge.dataSource;
                        this.$data.selected.push(clientDataModel.createGenericEndpoint(ge.id, ge.location, dataSource.type,
                            dataSource.id, dataSource.authentication.username, dataSource.authentication.password, ge.type));
                    }
                } catch (error) {
                    errorUtils.showError(error, "Get resource route");
                }
            }
        },
        editFile() {
            this.$data.loadedFile = null;
        },
        fileChange(file) {
            let reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = () => {
                let data = reader.result;
                this.$data.file = {
                    name: file.name,
                    data: data
                };
            }
            if (file.name.lastIndexOf(".") != -1) {
                this.$data.filetype = file.name.substring(file.name.lastIndexOf(".") + 1, file.name.length);
            } else {
                this.$data.filetype = "";
            }
        },
        isLocal() {
            return this.$data.active_tab == 0;
        }
    }
};
